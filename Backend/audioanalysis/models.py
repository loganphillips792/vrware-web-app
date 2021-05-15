from django.db import models
from users.models import CustomUser
from profile.models import Profile
import uuid


class PitchTopic(models.Model):

    # By default, Django gives each model the following field
    # id = models.AutoField(primary_key=True)

    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=150)

    slide_deck_url = models.URLField(max_length=500, null=True)

    # total_number_of_pitches_during_lifetime = models.IntegerField(default=0)

    profile = models.ForeignKey(
        Profile, 
        on_delete=models.CASCADE, 
        null=True
    )

    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "pitch_topic name: {} with id {}".format(self.name, self.id)

    class Meta:
        db_table="pitch_topic"
    
class Metrics(models.Model):
    # pronunciation_posteriori_probability_score_percentage = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    pronunciation_articulation_score = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    syllables_count = models.IntegerField(null=True)
    pauses_count = models.IntegerField(null=True)
    # number of pauses / duration (in seconds)
    pause_score = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    # Words per minute
    rate_of_speech = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    rate_of_speech_score = models.IntegerField(null=True)
    articulation_rate =  models.DecimalField(null=True, decimal_places=2, max_digits=5)
    # speaking duration without pauses
    speaking_duration = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    # speaking duration with pauses (total audio duration)
    original_duration = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    # combination of all of our other metrics (rate of speech, prounciation score, pause score, filler words score). For now, just add them all together and divide by 4
    audio_score = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    filler_words = models.CharField(null=True, max_length=150)
    filler_words_score = models.DecimalField(null=True, decimal_places=2, max_digits=5)
    number_of_words_spoken = models.IntegerField(null=True)
    

    def __str__(self):
        return "Posteriori probablility score: {} \n number of syllables: {} \n number of pauses: {} \n rate of speech: {} \n articulation rate: {} \n speaking_duration: {} \n original duration: {}".format(self.pronunciation_articulation_score, self.syllables_count, self.pauses_count, self.rate_of_speech, self.articulation_rate, self.speaking_duration, self.original_duration)

    class Meta:
        db_table="metric"

class Audio(models.Model):
    profile = models.ForeignKey(
        Profile, 
        on_delete=models.CASCADE, 
        null=True
    )

    pitch_topic = models.ForeignKey(
        PitchTopic, 
        on_delete=models.CASCADE, 
        null=True
    )
    
    metrics = models.OneToOneField(
        Metrics, 
        on_delete=models.CASCADE, 
        null=True
    )

    # name = models.CharField(max_length=10)
    s3_url = models.URLField(max_length=500)

    s3_transcription_url = models.URLField(max_length=500, null=True)

    transcript = models.TextField(default='')
   
    date_recorded = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return "pitch_topic: {} with id {}".format(self.pitch_topic.name, self.pitch_topic.id)

    class Meta: 
        db_table="audio"

class Note(models.Model):
    # pitch_topic = models.ForeignKey(
    #     PitchTopic, 
    #     on_delete=models.CASCADE, 
    #     null=True
    # )
    audio = models.ForeignKey(
        Audio, 
        on_delete=models.CASCADE, 
        null=True
    )
    content = models.CharField(max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
