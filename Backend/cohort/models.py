from django.db import models
import random, string

# Create your models here.

def generate_cohort_code():
    x = ""
    while True:
        x = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(6))
        if Cohort.objects.filter(code = x).count() == 0:
            break
    return x


class Cohort(models.Model):
    #class_admin_id, class_id, group code

    class_admin_username = models.CharField(
        max_length=150
    )

    # Code students will use to join this cohort
    code = models.CharField(
        max_length = 6,
        default=generate_cohort_code,
        unique=True
    )
