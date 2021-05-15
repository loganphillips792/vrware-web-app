from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from django.contrib.auth.models import User
from users.models import CustomUser
import datetime
import time
import pytz
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from users.serializers import UserSerializer, SubscriptionCodeSerializer
from profile.models import Profile
from profile.serializers import ProfileSerializer
from rest_framework import permissions, generics
from users.models import SubscriptionCode
import stripe

class SubscriptionCodeList(generics.ListAPIView):
    queryset = SubscriptionCode.objects.all()
    serializer_class = SubscriptionCodeSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubscriptionCodeDetail(generics.RetrieveAPIView):
    queryset = SubscriptionCode.objects.all()
    serializer_class = SubscriptionCodeSerializer
    lookup_field='code'
    lookup_url_kwarg='sub_code'

stripe.api_key = 'sk_test_51HBr7VFTzQiqEKMxzf5rc27Ff8F1bhP1P8IGqGKPIIuWl25n6IdPLebgc3pD8zgH0TO210flce7IvQ8d69tojOFZ00C2W0thRx'

@api_view(['POST'])
def create_payment_intent(request):
    # get product 
    p = stripe.Product.retrieve('prod_Hq8JhfXU3UzbCd')
    payment_intent = stripe.PaymentIntent.create(
        amount=1999, 
        currency='usd', 
        metadata={'integration_check': 'accept_a_payment', 'product_id':p.id},
    )
    return Response({'client_secret': payment_intent.client_secret})
