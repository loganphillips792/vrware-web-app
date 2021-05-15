from django.db import models

from django.contrib.auth.models import AbstractBaseUser
from django.utils import timezone
from .managers import CustomUserManager
from cohort.models import Cohort
import uuid

class SubscriptionCode(models.Model):
    # id = models.AutoField(primary_key=True)
    code = models.CharField(
        max_length=20,
        null=False, 
        unique=True
    )
    
    payment_amount = models.DecimalField(
        null=False, 
        decimal_places=2, 
        max_digits=5
    )
    
    expiration_date = models.DateField(auto_now_add=False, auto_now=False)
    
    class Meta:
        db_table="subscription_code"

# AbstractUserModel provides the core implementation of a user model, including hashed passwords and tokenized password resets
# https://docs.djangoproject.com/en/3.1/topics/auth/customizing/#specifying-a-custom-user-model
class CustomUser(AbstractBaseUser):
    # By default, Django gives each model the following field
    # id = models.AutoField(primary_key=True)

    #id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    #username_validator = UnicodeUsernameValidator()
    

    username = models.CharField(
        max_length=150, 
        unique=True,
        help_text=('Required. 150 Characters or fewer'),
        #validators=[username_validator],
        error_messages={
            'unique': 'A user with that username already exists'
        }
    )

    email = models.EmailField('email address', blank=False)

    is_email_verified = models.BooleanField(
        default=False,
        help_text='Designates whether the email has been verified.'
    )

    is_staff = models.BooleanField(
        'staff status',
        default=False,
        help_text='Designates whether the user can log into this admin site'
    )

    is_superuser = models.BooleanField(
        'Superuser status',
        default = False, 
        help_text='Whether the user is a superuser'
    )
    
    subscription_code = models.ForeignKey(
        SubscriptionCode, 
        on_delete=models.SET_NULL,
        null=True
    )

    cohort = models.ForeignKey(
        Cohort,
        on_delete=models.SET_NULL,
        null=True
    )

    #TODO: add class ID list

    date_joined = models.DateTimeField('date joined', default=timezone.now)

    objects = CustomUserManager()

    # field name on the User that will be used as the email field
    EMAIL_FIELD = 'email'
    # field name on the user model that is used as the unique identifier
    USERNAME_FIELD = 'username'
    # A list of the field names that will be prompted for when creating a user via the createsuperuser command
    REQUIRED_FIELDS = ['email']

    # make this look more like Metrics __str__
    def __str__(self):
        return "username: {} email: {} is_staff: {} is_superuser: {} date_joined: {}".format(self.username, self.email, self.is_staff, self.is_superuser, self.date_joined)

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
    
    class Meta:
        db_table = 'auth_user'
        

    
    

