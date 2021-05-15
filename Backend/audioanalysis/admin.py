from django.contrib import admin
from audioanalysis import models

# Register your models here.
admin.site.register(models.PitchTopic)
admin.site.register(models.Metrics)
admin.site.register(models.Audio)