from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.renderers import JSONRenderer
from . import speech
from .serializers import AudioSerializer, PitchTopicSerializer, NoteSerializer, MetricsSerializer
from .models import Audio, Metrics, PitchTopic, Note
from profile.models import Profile
from rest_framework.decorators import api_view, authentication_classes
from rest_framework import permissions
import boto3
from botocore.exceptions import ClientError
import os
from django.http import Http404
from rest_framework import status
import time;
from datetime import datetime
from VRWare.settings import S3_BUCKET_NAME, S3_URL, AWS_TRANSCRIBE_OUTPUT_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
from django.db.models import F
from decimal import Decimal
import json 
import string
from VRWare.celery import app
from django.core.files.storage import default_storage
import logging
import csv
from django.http import HttpResponse

logger = logging.getLogger(__name__)

class SuperUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return false

@api_view(['POST'])
def upload_audio(request):
    if request.method == 'POST' and request.user.is_authenticated:
        start_time = time.time()
        if 'audio_file' in request.FILES:
            file = request.data.get('audio_file')
            s3_client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_REGION
            )

            s3_key = str(request.user.id) + str(datetime.now()).replace("-", "").replace(":", "").replace(" ", "").split(".", 1)[0]
            root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            audio_dir = root_dir + "/media/audio/"
            file_name = default_storage.save(audio_dir+file.name+'.wav', file)
            logger.info(f"File is saved at {file_name}")
            with open(audio_dir+file.name+".wav", "rb") as f:
                response = s3_client.upload_fileobj(f, S3_BUCKET_NAME, s3_key+".wav")
            # Can't get this to work. The file that is uploaded is always 0 Bytes  
            # s3_client.upload_fileobj(file, S3_BUCKET_NAME, s3_key+".wav")
            task = do_work.delay(file.name, s3_key, request.data.get("pitch_topic"), request.user.id, start_time)
            #return to client 
            return Response({'msg': 'files have been uploaded. Work continuing in background'}, status.HTTP_202_ACCEPTED)
        elif 'file[]' in request.FILES:
            audio_list = []
            for file in request.FILES.getlist('file[]'):
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                    region_name=AWS_REGION
                )
                s3_key = str(request.user.id) + str(datetime.now()).replace("-", "").replace(":", "").replace(" ", "").split(".", 1)[0]
                # root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                # audio_dir = root_dir + "/media/audio/"
                # file_name = default_storage.save(audio_dir+file.name+'.wav', file) 
                with open(audio_dir+file.name+".wav", "rb") as f:
                    response = s3_client.upload_fileobj(f, S3_BUCKET_NAME, s3_key+".wav")
                task = do_work.delay(file.name, s3_key, request.data.get("pitch_topic"), request.user.id, start_time)
            clean_up_temp_directory()
            print('It took {0:0.1f} seconds to upload audio'.format(time.time() - start_time))
            return Response({'msg': 'files have been uploaded. Work continuing in background'}, status.HTTP_202_ACCEPTED)
            # print(JSONRenderer().render(AudioSerializer(audio_list, many=True).data))
            # return Response(AudioSerializer(audio_list, many=True).data, status.HTTP_202_ACCEPTED)
        else:
            print("User is logged in but No audio files provided")
    else:
        # AnonymousUser
        if request.method == 'POST' and not request.user.is_authenticated:
            start_time = time.time()
            if 'audio_file' in request.FILES:
                file = request.data.get('audio_file')
                metrics = get_metrics(file)
                metrics['date_recorded'] = datetime.now().strftime("%B %d, %Y at %I:%M%p")
                clean_up_temp_directory()
                print('It took {0:0.1f} seconds to upload audio'.format(time.time() - start_time))
                return Response({'uploaded_audio': metrics}, status.HTTP_202_ACCEPTED)
            else:
                print("User is NOT logged in but no audio files provided")
@app.task 
def do_work(file_name, s3_key, pitch_topic_id, user_id, start_time):
    logger.info("celery do_work() launching")
    metrics = get_metrics(file_name)
    audio = save_audio(metrics, s3_key, pitch_topic_id, user_id)
    logger.info("About to do speech to text")
    speech_to_text(audio.s3_url, audio.id)
    clean_up_temp_directory(file_name)
    logger.info('It took {0:0.1f} seconds to upload audio'.format(time.time() - start_time))

def get_metrics(file_name):     
    p=file_name
    metrics = speech.run_overview(p)
    words_per_minute = (Decimal(metrics['syllables_count'])/Decimal(metrics['original_duration']))*60/Decimal(1.66)
    articulation_rate = Decimal(metrics['syllables_count'])/Decimal(metrics['speaking_duration'])
    pro_post_prob_score_perc = speech.run_pronunciation_posteriori_probability_score_percentage(p)
    rounded = round(pro_post_prob_score_perc)
    metrics['pronunciation_articulation_score'] = Decimal(rounded).quantize(Decimal('.01'))
    metrics['rate_of_speech_score'] = 100 - abs(round(words_per_minute) - 132)
    metrics['rate_of_speech'] = words_per_minute.quantize(Decimal('.01'))
    metrics['articulation_rate'] = articulation_rate.quantize(Decimal('.01'))
    # metrics['pause_score'] = (Decimal(metrics['pauses_count']) /  Decimal(metrics['original_duration'])).quantize(Decimal('.01'))
    logger.info(f"get_metrics() finished: {metrics}")

    if metrics is False:
        logger.error("Audio file analysis failed while getting metrics")
        return Response({'msg':"Audio file analysis failed while getting metrics"}, status=status.HTTP_409_CONFLICT)
    return metrics

def save_audio(metrics, s3_key, pitch_topic_id, user_id):
    pitch_topic = PitchTopic.objects.get(pk=pitch_topic_id)
    profile = Profile.objects.get(user_id=user_id)
    # Create new metrics entry
    metrics_serializers = MetricsSerializer(data=metrics)
    metrics_object = None
    if metrics_serializers.is_valid():
        logger.info(f"Metrics data is valid: {metrics_serializers.validated_data}")
        metrics_object = metrics_serializers.save()
    else:
        logger.error(f"Error when serializer metrics: {metrics_serializers.errors}")
        return Response(metrics_serializers.errors)

    audio_serializer = AudioSerializer(data={'s3_url': ''.join([S3_URL, s3_key, '.wav']), 'profile_id': profile.id, 'pitch_topic_id': pitch_topic.id, 'metrics_id': metrics_object.id})

    if audio_serializer.is_valid():
        logger.info("Audio data is valid")
        audio = audio_serializer.save()
        #s3_client = boto3.client('s3')
        #root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        #audio_dir = root_dir + "/media/audio/"
        # with open(audio_dir+file.name+".wav", "rb") as f:
        #    response = s3_client.upload_fileobj(f, S3_BUCKET_NAME, s3_key+".wav")
        return audio
    else:
        logger.error(f"Error when serializing audio: {audio_serializer.errors}")
        return Response({'msg': audio_serializer.errors})

def speech_to_text(s3_url, id):
    logger.info(f"Running speech to text for {s3_url}")
    transcribe =  boto3.client(
        'transcribe',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    s3 = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    job_name = str(s3_url.rsplit('/', 1)[-1].rsplit('.',1)[0])
    job_uri = s3_url
    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': job_uri},
        MediaFormat='wav',
        LanguageCode='en-US', 
        OutputBucketName=AWS_TRANSCRIBE_OUTPUT_BUCKET
    )
    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        print("Not ready yet...")
        time.sleep(5)
    audio = Audio.objects.get(pk=id)
    audio.s3_transcription_url = job_uri
    key = job_uri.rsplit('/', 1)[-1].rsplit('.',1)[0]+'.json'
    data_in_bytes = s3.get_object(Bucket=AWS_TRANSCRIBE_OUTPUT_BUCKET, Key=key)['Body'].read()
    decoded_data = data_in_bytes.decode('utf-8')
    # Change to JSON
    data = json.loads(decoded_data) 
    transcript = data['results']['transcripts'][0]['transcript']
    audio.transcript = data['results']['transcripts'][0]['transcript']
    audio.save()
    
    metrics = Metrics.objects.get(id=audio.metrics_id)
    key = audio.s3_transcription_url.rsplit('/', 1)[-1].rsplit('.',1)[0]+'.json'
        
    pauses_per_second = round(metrics.pauses_count / metrics.original_duration, 2)

    metrics.number_of_words_spoken = get_number_of_spoken_words(key)

    metrics.pause_score = 0 if 100 - abs(round(pauses_per_second-Decimal(.420), 3))/Decimal(.002) <= 0.00 else 100 - abs(round(pauses_per_second-Decimal(.420), 3))/Decimal(.002)
    metrics.filler_words = getFillerWordsForPitch(key)
    percentage_of_filler_words = (sum(metrics.filler_words.values())/metrics.number_of_words_spoken)*100
    if percentage_of_filler_words < 2.00:
        metrics.filler_words_score = 100
    elif percentage_of_filler_words > 12.00:
        metrics.filler_words_score = 0
    else:
        metrics.filler_words_score = 100 - (round(percentage_of_filler_words - 2, 1)*10)
    # metrics.filler_words_score = 100 if percentage_of_filler_words < 2.00 else 100 - (round(percentage_of_filler_words - 2, 1)*10)
    metrics.audio_score = (Decimal(metrics.rate_of_speech) + Decimal(metrics.pronunciation_articulation_score) + Decimal(metrics.pause_score) + Decimal(metrics.filler_words_score)) / Decimal(4).quantize(Decimal('.01'))
    
    metrics.save()
    logger.info(f"speech_to_text() finished with metrics {metrics}")

# def clean_up_temp_directory():
#     logger.info("Cleaning up directory....")
#     root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#     temp_dir = root_dir + "/media/audio"

#     for filename in os.listdir(temp_dir):
#         if filename.endswith(".TextGrid"):
#             print("Deleting file " + os.path.join(temp_dir, filename))
#             os.remove(os.path.join(temp_dir, filename))
    
#     for filename in os.listdir(temp_dir):
#         if filename.endswith(".wav"):
#             print("Deleting file " + os.path.join(temp_dir, filename))
#             os.remove(os.path.join(temp_dir, filename))

def clean_up_temp_directory(file_name):
    logger.info(f"Removing file {file_name} from media/audio")
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    temp_dir = root_dir + "/media/audio"

   
    for filename in os.listdir(temp_dir):
        if filename.endswith(".wav"):
            print("Deleting file " + os.path.join(temp_dir, filename))
            os.remove(os.path.join(temp_dir, filename))


# Get the currently logged in user's audio data
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_all_audio_data(request):
    logger.info("getting all audio data %s", "Cool!")
    # logger.info("getting all audio data")
    if request.user.is_authenticated:
        # Get most recently uploaded audio file
        recently_recorded_pitch = Audio.objects.all().filter(profile_id__exact=request.user.profile.id).order_by('-date_recorded').first()
        pitch_topics = []

        # check if User owns pitch topics
        if PitchTopic.objects.filter(profile_id__exact=request.user.profile.id).exists():
            # if none of the pitch topics have audio files in them
            if not Audio.objects.all().filter(profile_id__exact=request.user.profile.id).exists():
                pitches_list = []
                pitch_topics = PitchTopic.objects.filter(profile_id__exact=request.user.profile.id).order_by('-date_created')
                for pitch in pitch_topics:
                    serial_pitch_topic = PitchTopicSerializer(pitch).data
                    # have most recent audio files be first in the list
                    audio_files = Audio.objects.filter(pitch_topic_id__exact=serial_pitch_topic.get('id')).order_by('date_recorded')
                    serializer = PitchTopicSerializer(pitch, context={'audio_files': audio_files})
                    pitches_list.append(serializer.data)

                return Response(pitches_list)
            
            elif recently_recorded_pitch.date_recorded > PitchTopic.objects.filter(profile_id__exact=request.user.profile.id).order_by('-date_created').first().date_created:
                # return pitch topics based on most recently updated, as long as there are Pitch Topics that belong to the user
              
                # get most recently updated pitch topic
                recently_updated_pitch_topic = PitchTopic.objects.get(pk=recently_recorded_pitch.pitch_topic_id)
                pitch_topics.append(recently_updated_pitch_topic)

                for pitch in PitchTopic.objects.filter(profile_id__exact=request.user.profile.id).order_by('-date_created').exclude(pk=recently_updated_pitch_topic.id):
                    pitch_topics.append(pitch)

            else:
                #return pitch topics based on most recently created
                pitch_topics = PitchTopic.objects.filter(profile_id__exact=request.user.profile.id).order_by('-date_created')

            pitches_list = []
            for pitch in pitch_topics:
                serial_pitch_topic = PitchTopicSerializer(pitch).data
                # have most recent audio files be first in the list
                audio_files = Audio.objects.filter(pitch_topic_id__exact=serial_pitch_topic.get('id')).order_by('date_recorded')
                serializer = PitchTopicSerializer(pitch, context={'audio_files': audio_files})
                pitches_list.append(serializer.data)

            return Response(pitches_list)
        else:
            return Response([])

# only allow logged in user 
# only allow user to delete his own objects
class PitchTopicList(APIView):

    #authentication_classes = []

    # get all pitch topics that belong to the user 
    def get(self, request, format=None): 
        if request.user.is_authenticated:
            pitch_topics = PitchTopic.objects.filter(profile_id__exact=request.user.profile.id)
            serializer = PitchTopicSerializer(pitch_topics, many=True)
            return Response(serializer.data)

    def post(self, request, format=None):
        # get profile id of logged in user
        # TODO: need to make sure that this user doesnt already have a pitch topic with the name from the form
        profile_id = Profile.objects.get(user_id=request.user.id).id
        if PitchTopic.objects.filter(profile_id__exact=profile_id).filter(name=request.data.get("pitch_topic").lstrip().rstrip()).exists():
            return Response(status=status.HTTP_409_CONFLICT)
        serializer = PitchTopicSerializer(data={"name":request.data.get("pitch_topic"), "profile_id":profile_id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PitchTopicDetail(APIView):
    def get_object(self, primary_key):
        try:
            return PitchTopic.objects.get(pk=primary_key)
        except PitchTopic.DoesNotExist:
            logger.error("Pitch topic object does not exist!")
            raise Http404

    # get all pitch topics that belong to the user 
    def get(self, request, pk, format=None): 
        if request.user.is_authenticated:
            pitch_topic = self.get_object(pk)
            audio_files = Audio.objects.filter(pitch_topic_id__exact=pitch_topic.id).order_by('date_recorded')
            serializer = PitchTopicSerializer(pitch_topic, context={'audio_files': audio_files})
            return Response(serializer.data)

    def put(self, request, pk):
        pitch_to_update = self.get_object(pk)
        if pitch_to_update.profile.user == request.user:
            logger.info("Pitch Topic update: User owns the pitch topic!")
        # check if user owns pitch topic with the name already, if so return 400 ERROR and have them enter agian
        if PitchTopic.objects.filter(profile_id__exact=pitch_to_update.profile.id).filter(name=request.data['newPitchTopicName'].lstrip().rstrip()).exists():
            logger.error("Pitch topic name already exists! Can't update")
            return Response(status=status.HTTP_409_CONFLICT)
        serializer = PitchTopicSerializer(pitch_to_update, data={'name': request.data['newPitchTopicName']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            logger.error("Pitch topic update failed: " + str(serializer.errors))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        pitch = self.get_object(pk)
        audio_files = Audio.objects.filter(pitch_topic_id__exact=pitch.id)
        for audio in audio_files:
            s3_client = boto3.resource('s3')
            s3_client.Object(S3_BUCKET_NAME, audio.s3_url.rsplit('/', 1)[-1]).delete()
            metrics = Metrics.objects.get(pk=audio.metrics.id).delete()
        pitch.delete()
        return Response({"deleted_pitch":PitchTopicSerializer(pitch).data},status=status.HTTP_200_OK)

class NotesList(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    # add logged in permission

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return Note.objects.filter(pitch_topic_id=pk)
    
    def post(self, request, pk):
        # serializer = NoteSerializer(data={'content': request.data.get('content'), 'pitch_topic_id': self.kwargs.get('pk')})
        serializer = NoteSerializer(data={'content': request.data.get('content'), 'audio_id': self.kwargs.get('pk')})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    lookup_url_kwarg = 'pk'

# only allow logged in user 
# only allow user to delete his own objects
class AudioDetail(APIView):

    def get_object(self, primary_key):
        try:
            return Audio.objects.get(pk=primary_key)
        except Audio.DoesNotExist:
            raise Http404
        
    def get(self, request, pk):
        audio = self.get_object(pk)
        if audio.profile.user == request.user:
            logger.info("The logged in user owns the audio file!")
        serializer = AudioSerializer(audio)
        return Response(serializer.data)

    def put(self, request, pk):
        audio_to_update = self.get_object(pk)
        if audio_to_update.profile.user == request.user:
            logger.info("User owns the audio file!")
        serializer = AudioSerializer(audio_to_update, data={'name': request.data['newAudioName']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        audio = self.get_object(pk)
        deleted_audio = audio.delete()
        s3_client = boto3.resource('s3')
        s3_client.Object(S3_BUCKET_NAME, audio.s3_url.rsplit('/', 1)[-1]).delete()
        # Have to manually delete. Compare ON_CASCADE on this model to ON_CASCADE to Notes model (audio foreign key)
        metrics = Metrics.objects.get(pk=audio.metrics.id).delete()
        # Notes associated with this audio are deleted because of on_delete=models.CASCADE, on the model field
        return Response({'deleted_object': AudioSerializer(audio).data})

class MetricsList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        
        sort =  self.request.query_params.get('sort', None)

        if sort is not None:
            if sort == 'date_recorded':
                list = []
                index = 1
                # https://stackoverflow.com/a/46371063/9599554
                for audio in PitchTopic.objects.get(id=pk).audio_set.all().order_by('date_recorded'):
                    json = MetricsSerializer(audio.metrics).data
                    json['pitch_name'] = 'Pitch ' + str(index)
                    list.append(json)
                    index += 1
                return Response(list)

            elif sort == '-date_recorded': # sort in descending order
                list = []
                index = 1
                # https://stackoverflow.com/a/46371063/9599554
                for audio in PitchTopic.objects.get(id=pk).audio_set.all().order_by('-date_recorded'):
                    json = MetricsSerializer(audio.metrics).data
                    json['pitch_name'] = 'Pitch ' + str(index)
                    list.append(json)
                    index += 1
                return Response(list)
        else:
            # sort in ascending order
            list = []
            index = 1
            # https://stackoverflow.com/a/46371063/9599554
            for audio in PitchTopic.objects.get(id=pk).audio_set.all().order_by('date_recorded'):
                json = MetricsSerializer(audio.metrics).data
                json['pitch_name'] = 'Pitch ' + str(index)
                list.append(json)
                index += 1
            return Response(list)

# Can I delete this?
@api_view(['GET'])
def filler_words(request, pk):
    filler_words_dict_list = []
    for audio in PitchTopic.objects.get(id=pk).audio_set.all():
        print(audio.s3_transcription_url)
        if audio.s3_transcription_url is None:
            continue
        key = audio.s3_transcription_url.rsplit('/', 1)[-1].rsplit('.',1)[0]+'.json'
        filler_words_dict = getFillerWordsForPitch(key)
        filler_words_dict_list.append({'audio_id': audio.id, 'filler_words_dict': filler_words_dict })
    print(filler_words_dict_list)
    return Response(filler_words_dict_list)

def getFillerWordsForPitch(key):
    FILLER_WORDS = [
    'actually', 'ah', 'as i said', 'at the end of the day', 'basically', 'believe me', 'clearly', 'er', 'for example', 'for instance', 
    'hum', 'i guess', 'i mean', 'i suppose', 'like', 'literally', 'okay', 'or something', 'right', 'see', 'seriously', 'so', 
    'stuff', 'stuffs', 'thing', 'things', 'totally', 'uh', 'um', 'well', 'you know', 'you know what i mean', 'you see'
    ]
    # Store JSON file in memory, instead of downloading it to system
    # s3 = boto3.client('s3')
    s3 = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
    )
    data_in_bytes = s3.get_object(Bucket=AWS_TRANSCRIBE_OUTPUT_BUCKET, Key=key)['Body'].read()
    decoded_data = data_in_bytes.decode('utf-8')
    # Change to JSON
    data = json.loads(decoded_data)
    # pretty print
    # print(json.dumps(data, indent=4, sort_keys=True))
    transcript = data['results']['transcripts'][0]['transcript']
    translator = str.maketrans('', '', string.punctuation)
    transcript_removed_punctuation = transcript.translate(translator)
    words_list = [word.lower() for word in transcript_removed_punctuation.split()]
    filler_words_dict = {}
    for word in words_list:
        if word in FILLER_WORDS:
            if not word in filler_words_dict:
                filler_words_dict[word] = 1
            else:
                filler_words_dict[word] += 1
    return filler_words_dict

def get_number_of_spoken_words(key):
    s3 = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
    )
    data_in_bytes = s3.get_object(Bucket=AWS_TRANSCRIBE_OUTPUT_BUCKET, Key=key)['Body'].read()
    decoded_data = data_in_bytes.decode('utf-8')
    # Change to JSON
    data = json.loads(decoded_data)
    num_of_words = 0
    for x in data['results']['items']:
        if x['type'] != 'punctuation':
            num_of_words += 1
    return num_of_words

# pronunciation score
def get_confidence_score_totals(key):
    s3 = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    data_in_bytes = s3.get_object(Bucket=AWS_TRANSCRIBE_OUTPUT_BUCKET, Key=key)['Body'].read()
    decoded_data = data_in_bytes.decode('utf-8')
    # Change to JSON
    data = json.loads(decoded_data)
    sum = 0
    for x in data['results']['items']:
        if x['type'] != 'punctuation':
            sum += float(x['alternatives'][0]['confidence'])
    return sum
    
# Used for Improvement Report
@api_view(['POST'])
def analyze_single_metric(request):
    if request.method == 'POST' and request.user.is_authenticated:
        metric_to_analyze = request.data.get('metric_to_analyze')
        value_to_send_back = ""
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        audio_dir = root_dir + "/media/audio/"
        file = request.data.get('audio_file')
        default_storage.save(audio_dir+file.name+'.wav', file)
        logger.info(f"metric to analyze: {metric_to_analyze}")
        if metric_to_analyze == 'rate_of_speech_slow' or metric_to_analyze == 'rate_of_speech_fast':
            logger.info("Analyzing rate of speech")
            metrics = speech.run_overview(file.name)

            if metrics is False:
                return Response({"msg": "Error uploading file"}, status.HTTP_400_BAD_REQUEST)

            words_per_minute = (Decimal(metrics['syllables_count'])/Decimal(metrics['original_duration']))*60/Decimal(1.66)
            value_to_send_back = round(words_per_minute, 0)
        elif metric_to_analyze == 'pronunciation_score':
            logger.info("Analying pronunciation score")
            metrics = speech.run_pronunciation_posteriori_probability_score_percentage(file.name)
            
            if metrics is False:
                return Response({"msg": "Error uploading file"}, status.HTTP_400_BAD_REQUEST)
            rounded = round(metrics)
            value_to_send_back = rounded
            
        elif metric_to_analyze == 'pause_score':
            logger.info("Analyzing pause score")
            metrics = speech.run_overview(file.name)
            
            if metrics is False:
                return Response({"msg": "Error uploading file"}, status.HTTP_400_BAD_REQUEST)

            pauses_per_second = round(metrics.pauses_count / metrics.original_duration, 2)

        elif metric_to_analyze == 'filler_words_score':
            logger.info("Analyzing filler words score")
            
        clean_up_temp_directory(file.name)
        return Response({"metric_to_analyze": metric_to_analyze, "value": value_to_send_back}, status.HTTP_202_ACCEPTED)
    else:
        logger.info("user is not logged in")

@api_view(['GET'])
def download_audio_file(request, pk):

    pitch = Audio.objects.get(pk=pk)
    s3_key = str(pitch.s3_url.rsplit('/', 1)[-1].rsplit('.',1)[0])
    logger.info(f"S3 key to find {s3_key}")

    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

    s3_response_object = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=s3_key+'.wav')
    object_content = s3_response_object['Body'].read()
    response = HttpResponse(object_content, content_type='audio/wav')
    """
    Ideally, this would just download on the frontend without having to do anything, but I think Nginx is getting in the way. 
     When I look at the response in Chrome Dev tools when the download button is clicked, I don't see 'Content-Disposition header in the response and
     it comes back as text/html
    """
    # response['Content-Disposition'] = 'attachment; filename="pitch.wav"'
    return response

@api_view(['GET'])
def csv_export(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="export.csv"'
    writer = csv.DictWriter(response, fieldnames=['emp_name', 'dept', 'birth_month'])
    writer.writeheader()
    writer.writerow({'emp_name': 'John Smith', 'dept': 'Accounting', 'birth_month': 'November'})
    writer.writerow({'emp_name': 'Erica Meyers', 'dept': 'IT', 'birth_month': 'March'})
    return response

