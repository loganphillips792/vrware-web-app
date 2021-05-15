from django.urls import reverse
from users.models import CustomUser as User
from profile.models import Profile
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

# Have to be in 'Backend' directory to run tests. Then python manage.py test

class ProfileTestCase(APITestCase):
    def setUp(self):
        self.username = "john"
        self.email = "john@snow.com"
        self.password = "you_know_nothing"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        client = APIClient()
        client.login(username=self.user.username, password=self.user.password)
    
    def test_create_profile(self):
        url = reverse('profile-list')
        data = {"user_id": self.user.id, "first_name": "Ben", "last_name": "Robertson", "email": "ben005@gmail.com", "birth_date":"1996-04-24", "country":"United States"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)