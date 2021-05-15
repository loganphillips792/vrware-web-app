#from django.contrib.auth.models import User
from users.models import CustomUser
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from users.serializers import UserSerializer
from audioanalysis.models import Audio, Metrics, PitchTopic
from profile.models import Profile
from rest_framework import status
import boto3
from VRWare.settings import S3_BUCKET_NAME, S3_URL

# https://stackoverflow.com/questions/16857450/how-to-register-users-in-django-rest-framework
class UserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    authentication_classes = []

class UserDetail(generics.RetrieveDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    authentication_classes = []

    def delete(self, request, *args, **kwargs):
        user = self.get_object()

        if Profile.objects.filter(user_id=user.id).exists():
             # Delete metrics 
            audio_files = Audio.objects.filter(profile_id=Profile.objects.get(user_id=user.id).id)
            s3_client = boto3.resource('s3')
            for audio in audio_files:
                print(audio.s3_url)
                s3_client.Object(S3_BUCKET_NAME, audio.s3_url.rsplit('/', 1)[-1]).delete()
                metrics = Metrics.objects.get(pk=audio.metrics.id)
                metrics.delete()
            # Delete user, which will delete profile, which will delete audio files
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CreateUser(generics.CreateAPIView):
    serializer_class = UserSerializer
