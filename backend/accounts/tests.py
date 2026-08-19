from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Category, Staff

class AccountCategoryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Solar Engineering',
            description='Solar project management'
        )

    def test_list_categories(self):
        response = self.client.get('/api/accounts/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_category(self):
        data = {'name': 'Wind Power', 'description': 'Wind farm operations'}
        response = self.client.post('/api/accounts/categories/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Wind Power')

    def test_update_category(self):
        data = {'name': 'Solar & Renewable Engineering', 'description': 'Updated description'}
        response = self.client.put(f'/api/accounts/categories/{self.category.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Solar & Renewable Engineering')

    def test_delete_category(self):
        response = self.client.delete(f'/api/accounts/categories/{self.category.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.filter(id=self.category.id).exists())


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.superuser = User.objects.create_superuser(
            username='adminuser',
            email='admin@meda.gov.in',
            password='SecretPassword123'
        )

    def test_login_with_username(self):
        data = {'username': 'adminuser', 'password': 'SecretPassword123'}
        response = self.client.post('/api/accounts/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_with_email(self):
        data = {'username': 'admin@meda.gov.in', 'password': 'SecretPassword123'}
        response = self.client.post('/api/accounts/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['username'], 'adminuser')
