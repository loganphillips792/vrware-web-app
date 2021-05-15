from django.urls import path
from profile.views import ProfileList, ProfileDetail, LoggedInUserProfileDetail

urlpatterns = [
    path('api/profiles/', ProfileList.as_view(), name="profile-list"),
    path('api/profiles/<int:pk>', ProfileDetail.as_view()),
    path('api/profiles/logged_in', LoggedInUserProfileDetail.as_view())
]