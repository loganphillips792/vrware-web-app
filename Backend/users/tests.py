from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class UserAPITestCase(APITestCase):
    def test_user_registration(self):
        self.url = reverse('register-user')
        user_data = {
            "userName": "testuser",
            "email": "testuser@gmail.com",
            "password": "TESTPASSWORD"
        }
        response = self.client.post(self.url, user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

