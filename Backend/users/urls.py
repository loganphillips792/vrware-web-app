from django.contrib import admin
from django.urls import path

from audioanalysis.urls import urlpatterns as audio_urls
from profile.urls import urlpatterns as profile_urls
import login
from users import views

# pk will be the name of the parameter passed to the get() method. We can name this whatever we want.
urlpatterns = [
    path('api/users/', views.UserList.as_view()),
    path('api/users/<int:id>', views.UserDetail.as_view()),
    path('api/users/', views.CreateUser.as_view())
]


