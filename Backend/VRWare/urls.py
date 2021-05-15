"""VRWare URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from audioanalysis.urls import urlpatterns as audio_urls
from profile.urls import urlpatterns as profile_urls
from users.urls import urlpatterns as users_urls
import login
import vrware_email
from VRWare.payments import SubscriptionCodeDetail
"""
docs.djangoproject.com/en/2.2/topics/urls - How Django processes a request, path converters, custom path converters (class and regular expressions)
"""

# pk will be the name of the parameter passed to the get() method. We can name this whatever we want.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login.login_view),
    path('logout/', login.logout_view),
    path('register/', login.register_user, name="register-user"),
    # Social Auth callbacks
    path('api/social/<backend>/', login.exchange_token, name="social-auth"),
    path('verifysession/', login.verify_session),
    path('api/email', vrware_email.email), 
    path('api/subscriptions/code/<sub_code>', SubscriptionCodeDetail.as_view()), 
    path('users/validate-email-token', login.validate_email_token)
]

urlpatterns += audio_urls
urlpatterns += profile_urls
urlpatterns += users_urls

