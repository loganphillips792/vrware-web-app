from .models import Audio, Metrics, PitchTopic, Note
from profile.serializers import ProfileSerializer
from rest_framework import serializers
import boto3
from botocore.exceptions import ClientError
from VRWare.settings import S3_URL

class NoteSerializer(serializers.Serializer):
    # id is automatically created, so don't need to write it
    id = serializers.IntegerField(source="pk", read_only=True)
    # pitch_topic = PitchTopicSerializer(read_only=True)
    #pitch_topic_id = serializers.IntegerField(write_only=True)
    audio_id = serializers.IntegerField(write_only=True)
    id_of_audio_note_belongs_to = serializers.IntegerField(source='audio_id', read_only=True)
    content = serializers.CharField(max_length=1000, trim_whitespace=True)
    date_created = serializers.DateTimeField(read_only=True)
    date_updated = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Note.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()

    def validate(self, data):
        print("valdiated data is")
        print(data)
        return data

class MetricsSerializer(serializers.Serializer):
    # pronunciation_posteriori_probability_score_percentage = serializers.DecimalField(default=None, allow_null=True, max_digits=5, decimal_places=2)
    pronunciation_articulation_score = serializers.DecimalField(allow_null=True, required=False, decimal_places=2, max_digits=5)
    syllables_count = serializers.IntegerField(allow_null=True)
    pauses_count = serializers.IntegerField(allow_null=True)
    rate_of_speech = serializers.DecimalField(allow_null=True, decimal_places=2, max_digits=5)
    rate_of_speech_score = serializers.IntegerField(allow_null=True)
    # articulation_rate = serializers.IntegerField(allow_null=True)
    articulation_rate = serializers.DecimalField(allow_null=True, decimal_places=2, max_digits=5)
    speaking_duration = serializers.DecimalField(allow_null=True, decimal_places=2, max_digits=5)
    original_duration = serializers.DecimalField(allow_null=True, decimal_places=2, max_digits=5)
    filler_words = serializers.CharField(allow_null=True, required=False, max_length=1000)
    filler_words_score = serializers.DecimalField(allow_null=True, required=False, decimal_places=2, max_digits=5)

    pause_score = serializers.DecimalField(allow_null=True, required=False, decimal_places=2, max_digits=5)
    
    audio_score = serializers.DecimalField(allow_null=True, required=False, decimal_places=2, max_digits=5)
    # total_audio_score = serializers.DecimalField(source='metrics.audio_score', allow_null=True, decimal_places=2, max_digits=5)
    
    number_of_words_spoken = serializers.IntegerField(allow_null=True, required=False)

    def create(self, validated_data):
        """
        Create and return a new 'Metrics' instance, given the validated data
        """
        return Metrics.objects.create(**validated_data)

class AudioSerializer(serializers.Serializer):
    class Meta:
        # Django inserts the date automatically for us (auto_now_add), so we don't want to pass it in to serialzier when writing
        read_only_fields = ['date_recorded']
    # Define the fields that get serialized/deserialized
    id = serializers.IntegerField(source="pk", read_only=True)
    #name = serializers.CharField(max_length=10, required=False)
    #audio_file = serializers.FileField(required=False)
    s3_url = serializers.URLField(max_length=500, allow_blank=False, required=False)
    # In DRF, CharField corresponds to both CharField and TextField
    transcript = serializers.CharField(default='')
    #pitch_topic = serializers.CharField(max_length=150, allow_blank=False, required=True)
    profile = ProfileSerializer(read_only=True)
    #pitch_topic = PitchTopicSerializer(read_only=True)
    metrics = MetricsSerializer(read_only=True)

    # https://www.vhinandrich.com/blog/saving-foreign-key-id-django-rest-framework-serializer
    profile_id = serializers.IntegerField(write_only=True)
    pitch_topic_id = serializers.IntegerField(write_only=True)
    metrics_id = serializers.IntegerField(write_only=True)

    date_recorded = serializers.DateTimeField(read_only=True)
    # reverse relationship
    notes = NoteSerializer(source='note_set',read_only=True, many=True)

    def create(self, validated_data):
        """
        Create and return a new 'Audio' instance, given the validated data
        """
        return Audio.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        old_instance_key = instance.name+'.wav'
        instance.name = validated_data.get('name', instance.name)
        instance.s3_url = S3_URL + validated_data.get('name')+'.wav'
        # Change the key on S3
        # s3_client = boto3.resource('s3')
        # s3_client.Object('vrwarebucket', validated_data.get('name')+'.wav').copy_from(CopySource='vrwarebucket/'+old_instance_key)
        # s3_client.Object('vrwarebucket', old_instance_key).delete()
        instance.save()
        return instance

    # In rare cases where none of the existing relational styles fit the representation you need, you can implement a completely custom relational field, that describes exactly how the output representation should be generated from the model instance
    def to_representation(self, instance):
        representation = super(AudioSerializer, self).to_representation(instance)
        representation['date_recorded'] = instance.date_recorded.strftime("%Y-%m-%d")

        # representation['date_recorded'] = instance.date_recorded.strftime("%B %d, %Y at %I:%M%p") # December 19, 2020 at 5:20AM
        return representation

    # object level validation
    def validate(self, data):
        return data

    def validate_name(self, value):
        return value

    def validate_s3_url(self, value):
        return value

    def validate_date_recorded(self, value):
        return value

class PitchTopicSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="pk", read_only=True)
    name = serializers.CharField(max_length=150, trim_whitespace=True)
    slide_deck_url = serializers.URLField(max_length=500, allow_null=True, required=False)
    date_created = serializers.DateTimeField(read_only=True)
    
    audio_files = serializers.SerializerMethodField('get_audio_files')
    profile = ProfileSerializer(read_only=True)
    profile_id = serializers.IntegerField(write_only=True)

    # In rare cases where none of the existing relational styles fit the representation you need, you can implement a completely custom relational field, that describes exactly how the output representation should be generated from the model instance
    def to_representation(self, instance):
        representation = super(PitchTopicSerializer, self).to_representation(instance)
        representation['date_created'] = instance.date_created.strftime("%B %d, %Y at %I:%M%p")
        return representation

    def get_audio_files(self, obj):
        return AudioSerializer(self.context.get('audio_files'), many=True).data

    def create(self, validated_data):
        """
        Create and return a new 'PitchTopic' instance, given the validated data
        """
        return PitchTopic.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        # instance.slide_deck_url = validated_data.get('slide_deck_url', instance.slide_deck_url)
        instance.save()
        # Change the key on S3
        # need to change key on s3 because pitch topic name is in the key
        #s3_client = boto3.resource('s3')
        #s3_client.Object('vrwarebucket', validated_data.get('name')+'.wav').copy_from(CopySource='vrwarebucket/'+old_instance_key)
        #s3_client.Object('vrwarebucket', old_instance_key).delete()
        return instance