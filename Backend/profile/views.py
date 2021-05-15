from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views import View
from profile import models
from audioanalysis.models import Audio, Metrics, PitchTopic
import json 
#from profile import status
from django.http import Http404
from django.db import connection
from django.core import serializers
from profile import forms
from django.views.decorators.http import require_http_methods
import logging
from profile.serializers import ProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from profile.serializers import ProfileSerializer
from audioanalysis.serializers import AudioSerializer, PitchTopicSerializer

"""
# Get the currently logged in user's profile data
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_session_profile(request):
    
    if request.user.is_authenticated:
        # Get the profile data assoicated with the logged in user
        user = request.user
        user_profile = models.Profile.objects.get(user_id=user.id)
        audio_files = Audio.objects.all().filter(profile_id__exact=user_profile.id)
        pitch_topic_ids = audio_files.values_list('pitch_topic_id', flat=True)
        # always best to use pk instead of id as the interval value pk will always point to the primary key field, even if it is not called 'id'
        pitches = PitchTopic.objects.filter(pk__in=pitch_topic_ids)
        
        pitches_list = []
        for pitch in pitches:
            ser_pitch = PitchTopicSerializer(pitch).data
            # This is going to return a list of Querysets
            audio_files = Audio.objects.filter(pitch_topic_id__exact=ser_pitch.get('id'))
            serializer = PitchTopicSerializer(pitch, context={'audio_files': audio_files})
            pitches_list.append(serializer.data)

        return Response(pitches_list)
"""

# Create your views here.

logger = logging.getLogger(__name__)


class LoggedInUserProfileDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, request):
        try:
            return models.Profile.objects.get(user_id__exact=request.user.id)
        except models.Profile.DoesNotExist:
            raise Http404
    
    def get(self, request, format=None):
        logged_in_profile = self.get_object(request)
        serializer = ProfileSerializer(logged_in_profile)
        return Response(serializer.data)

class ProfileList(APIView):

    authentication_classes = []

    """
    List all profiles, or create a new one
    """
    def get(self, request, format=None):
        profiles = models.Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else: 
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileDetail(APIView):
    
    """
    Retrieve, update, or delete a profile instance
    """

    def get_object(self, primary_key):
        try: 
            return models.Profile.objects.get(pk=primary_key)
        except Profile.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        profile = self.get_object(pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        profile = self.get_object(pk)
        # Partial = True allows a Patch. django-rest-framework.org/api-guide/serializers/#partial-updates
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        profile = self.get_object(pk)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@require_http_methods(["POST"])
def upload_document(request):
    if request.method == 'POST':
        newDoc = models.Document(docfile=request.FILES['docfile'])
        newdoc.save()
# postman: body > form-data. key: 'file' value: the file (type is file, not text)
@require_http_methods(["POST"])
def upload_image(request):
    print(request.FILES)
    if request.method == 'POST':
        form = forms.ImageForm(request.POST,request.FILES)
        print(form.errors)
        if form.is_valid():
            cd = form.cleaned_data
            image_model = models.Image(picture=cd['file'])
            image_model.save()
        else:
            print("image is not valid")
        #form.save()
        return HttpResponse("image succesfully uploaded")
        #return HttpResponse(status=status.Code.HTTP_100_CONTINUE)

