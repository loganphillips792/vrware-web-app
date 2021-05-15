from django.urls import reverse
from users.models import CustomUser as User
from audioanalysis.models import Audio, PitchTopic
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from profile.models import Profile
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
import io 
from rest_framework.parsers import JSONParser
import boto3


# cd Backend
# python manage.py test

# to test specific method python manage.py test audioanalysis.tests.PitchTopicTestCase.test_delete_pitchtopic
class PitchTopicTestCase(APITestCase):
    def setUp(self):
        # create a user object for our tests
        self.username = "john"
        self.email = "john@gmail.com"
        self.password = "you_know_nothing"
        self.user = User.objects.create_user(self.username, self.email, self.password)

        # create a profile object for our tests
        self.profile = Profile.objects.create(user=self.user, first_name="Ben", last_name="Robertson", email="ben005@gmail.com", birth_date="1996-04-24", country="United States")
        self.client.login(username=self.user.username, password="you_know_nothing")

        # create a pitch topic to use for update
        self.pitch_topic = PitchTopic.objects.create(name="Pitch Topic 1", profile_id=self.profile.id)

    def test_create_pitchtopic(self):
        url = reverse("pitch-topic-list")
        data = {"pitch_topic": "Pitch Topic 1", "profile_id": self.profile.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_update_pitchtopic(self):
        url = reverse("pitch-topic-detail", kwargs={"pk": self.pitch_topic.id})
        response = self.client.put(url, {"newPitchTopicName": "Pitch Topic 2"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_pitchtopic(self):
        self.upload_file()
        url = reverse("pitch-topic-detail", kwargs={"pk": self.pitch_topic.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # we don't want to upload the audio files in setUp because it happens before each test method
    def upload_file(self):
         # Upload audio file (this creates object too)
        url = reverse('upload-audio')
        filename = 'audio'
        file = File(open(settings.BASE_DIR+'/audioanalysis/OSR_us_000_0036_8k.wav', 'rb'))
        uploaded_file = SimpleUploadedFile(filename, file.read())
        response = self.client.post(url, {'audio_file': uploaded_file, 'pitch_topic': self.pitch_topic.id})
        
class AudioTestCase(APITestCase):
    def setUp(self):
        # create a user object for our tests
        self.username = "john"
        self.email = "john@gmail.com"
        self.password = "you_know_nothing"
        self.user = User.objects.create_user(self.username, self.email, self.password)

        # create a profile object for our tests
        self.profile = Profile.objects.create(user=self.user, first_name="Ben", last_name="Robertson", email="ben005@gmail.com", birth_date="1996-04-24", country="United States")
        self.client.login(username=self.user.username, password="you_know_nothing")

        # create a pitch topic to use for update
        self.pitch_topic = PitchTopic.objects.create(name="Pitch Topic 1", profile_id=self.profile.id)

        # create audio files for testing delete
"""
    def test_upload_audio(self):
        url = reverse('upload-audio')
        filename = 'audio'
        file = File(open(settings.BASE_DIR+'/audioanalysis/OSR_us_000_0036_8k.wav', 'rb'))
        uploaded_file = SimpleUploadedFile(filename, file.read())
        response = self.client.post(url, {'audio_file': uploaded_file, 'pitch_topic': self.pitch_topic.id})
        s3_client = boto3.resource('s3')
        s3_client.Object('vrwarebucket', 'OSR_us_000_0036_8k.wav').delete()
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
"""

    #def test_delete_audio(self):
      #  url = reverse('audio-detail')

