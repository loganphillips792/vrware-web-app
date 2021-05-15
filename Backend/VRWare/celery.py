from __future__ import absolute_import, unicode_literals
import os
from celery import Celery, signals
import logging

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VRWare.settings')

app = Celery('VRWare')

"""
app = Celery('VRWare', 
            broker='redis://localhost:6379/0', 
            # backend='amqp://', 
            include=['VRWare.tasks'])
"""

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {01r}'.format(self.request))

# https://stackoverflow.com/a/52190919
@signals.setup_logging.connect
def setup_celery_logging(**kwargs):
    return logging.getLogger('celery')