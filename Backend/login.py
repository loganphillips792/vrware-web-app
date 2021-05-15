from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from django.contrib.auth.models import User
from users.models import CustomUser
import datetime
import time
import pytz
from rest_framework import status, serializers
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from users.serializers import UserSerializer
from profile.models import Profile
from profile.serializers import ProfileSerializer
from django.conf import settings
from django.utils.crypto import get_random_string
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
import logging
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from six import text_type
import json
from social_django.utils import psa
from requests.exceptions import HTTPError

logger = logging.getLogger(__name__)

@api_view(['POST'])
# @ensure_csrf_cookie
def login_view(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"message":"Login successful"},status=status.HTTP_200_OK)
    else:
        logger.error("User not authenticated")
        return Response({"message":"Login failed"},status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'msg': 'Logout successful'})

@api_view(['POST'])
def register_user(request):
    token_generator = AppTokenGenerator()

    data = {'username':request.data["userName"], 'password':request.data["password"], 'email':request.data["email"]}
    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        data = {'user_id':user.id,'first_name':request.data["firstName"], 'last_name':request.data["lastName"], 'email':request.data["email"], 'birth_date':None, 'country':None}
        profile_serializer = ProfileSerializer(data=data)
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            logger.error(profile_serializer.errors)
        login(request, user)
        logger.info("Preparing email...")
        FRONTEND_URL = settings.FRONTEND_URL
        BACKEND_URL = settings.BACKEND_URL
        # token = get_random_string(length=32)
        token = token_generator.make_token(user)
        verify_link = FRONTEND_URL + 'verify-email/' + token
        subject, from_email, to = 'Verify your email', settings.EMAIL_HOST_USER, request.data["email"]
        html_content = render_to_string('verify_email.html', {'verify_link': verify_link, 'base_url': FRONTEND_URL, 'backend_url': BACKEND_URL})
        text_content = strip_tags(html_content)
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to, 'loganphillips598@gmail.com'])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info("Verification email sent")
        return Response({'user': user_serializer.data})
    else:
        logger.error(user_serializer.errors)

@api_view(['POST'])
def verify_session(request):
    if request.user.is_authenticated:
        user_serializer = UserSerializer(request.user)
        return Response({"authenticated_user": user_serializer.data},status=status.HTTP_200_OK)
    else:
        return Response({"msg":"User is not authenticated"},status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def validate_email_token(request):
    token_generator = AppTokenGenerator()

    token = request.data['token']
    logger.info(f"Validating the following token: {token}")
    
    if CustomUser.objects.filter(id=request.user.id).exists():
        user = CustomUser.objects.get(id=request.user.id)
        if token_generator.check_token(user, token):
            logger.info("Token is correct")
            
            user.is_email_verified = True
            res = {
                'status': 'success', 
                'message': 'Valid'
            }
        else:
            logger.info("Token is NOT correct")
            user.is_email_verified = False
            res = {
                'status': 'failed', 
                'message': 'Invalid'
            }
        return Response(res)
    else:
        res = {
                'status': 'failed', 
                'message': 'User does not exist'
            }
        return Response(res)

class AppTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (text_type(user.id) + text_type(timestamp))

class SocialSerializer(serializers.Serializer):
    """
    Serializer which accepts an OAuth2 code
    """

    code = serializers.CharField(allow_blank=False, trim_whitespace=True)
    
# https://briancaffey.github.io/2020/11/27/how-to-authenticate-django-rest-framework-from-vue-app-with-session-authentication-httponly-cookies/
@api_view(['POST'])
@psa()
def exchange_token(request, backend):
    logger.info(f"Token is {request.data['code']}")
    logger.info(f"Badckend is {backend}")
    serializer = SocialSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        code = serializer.validated_data["code"]
        # access_token = get_access_token_from_code(backend, code)
        try:
            # user = request.backend.do_auth(access_token)
            user = request.backend.do_auth(code)
        except HTTPError as e:
            return Response({"errors": {"token": "Invalid token", "detail": str(e)}}, status=status.HTTP_400_BAD_REQUEST)
        
        if user:
            # create profile here?? (Copy from register method)
            if user.is_active:
                login(request, user)
                return Response({"detail": "Success"})
            else:
                return Response({"errors": "This user account is inactive"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"errors": "Authentication failed"}, status=status.HTTP_400_BAD_REQUEST)
# Currently not being used. Would use if we were passing Authorization code from the frontend, to here, then to the OAuth service to get the Access token.
# We are currently getting the actual Access token on the frontend, so, we don't need this as of right now
def get_payload(backend, code):
    if backend == "google-oauth2":
        payload ={
            "code": code, 
            "client_id": "804867060664-8p1k8rudvms4ph1tip7vflqev5g3ukt1.apps.googleusercontent.com",
            "client_secret": "",
            "redirect_uri": "http://localhost/auth/google-oauth2/callback",
            "grant_Type": "authorization_code",
        }
    else:
        print("Backend service not recognized")

# Currently not being used. Would use if we were passing Authorization code from the frontend, to here, then to the OAuth service to get the Access token.
# We are currently getting the actual Access token on the frontend, so, we don't need this as of right now
def get_access_token_from_code(backend, code):
    # Get access token for any OAuth backend 
    url = OAUTH[backend]["url"]
    payload = get_payload(backend, code)

    if backend == "google-oauth2":
        r = requests.post(url, data=payload)
        token = r.json()["access_token"]
        return token
    

OAUTH = {
    "google-oauth2": {
        "name": "google-oauth2",
        "url": "https://oauth2.googleapis.com/token",
    },
}

# Last step of social auth pipeline
def create_profile(user, *args, **kwargs):
  
    if Profile.objects.filter(user=user).exists():
        pass
    else:
        # Will this work with other OAuth services, or do we need to look at kwargs['backend'] and get the data appropriately from kwargs?
        data = {'user_id':user.id,'first_name': kwargs['details']['first_name'], 'last_name': kwargs['details']['last_name'], 'email': kwargs['details']['email'], 'birth_date':None, 'country':None}
        
        profile_serializer = ProfileSerializer(data=data)
        if profile_serializer.is_valid():
            profile_serializer.save()