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

# audio analysis app
from audioanalysis.views import upload_audio, AudioDetail, PitchTopicList, PitchTopicDetail, NotesList, NotesDetail, MetricsList, get_all_audio_data, filler_words, analyze_single_metric, csv_export, download_audio_file
"""
docs.djangoproject.com/en/2.2/topics/urls - How Django processes a request, path converters, custom path converters (class and regular expressions)
"""

# pk will be the name of the parameter passed to the get() method. We can name this whatever we want.
urlpatterns = [
    path('api/upload_audio', upload_audio, name="upload-audio"), 
    path('api/audio/<int:pk>', AudioDetail.as_view(), name="audio-detail"),
    path('api/audio/<int:pk>/notes', NotesList.as_view()),
    path('api/audio/<int:pk>/download', download_audio_file),
    path('api/audio/notes/<int:pk>', NotesDetail.as_view()),
    path('api/pitchtopics', PitchTopicList.as_view(), name="pitch-topic-list"),
    path('api/pitchtopics/<int:pk>', PitchTopicDetail.as_view(), name="pitch-topic-detail"),
    path('api/pitchtopics/<int:pk>/metrics', MetricsList.as_view()),
    path('api/pitchtopics/<int:pk>/metrics/fillerwords', filler_words),
    path('api/get_all_audio_data', get_all_audio_data),
    path('api/analyze_single_metric', analyze_single_metric),
    path('api/export', csv_export)
]

# DEBUG must be set to 'False' in settings.py for this to work
handler404='api.views.handle_404_method'