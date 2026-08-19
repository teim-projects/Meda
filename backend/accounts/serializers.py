from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken  # ← Make sure this import works
from .models import Category, Staff


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        username_or_email = data.get('username')
        password = data.get('password')

        if username_or_email and password:
            request = self.context.get('request')
            user = authenticate(request=request, username=username_or_email, password=password)

            if not user:
                # Direct fallback attempt if request wasn't passed in context
                user_obj = User.objects.filter(email__iexact=username_or_email).first() or User.objects.filter(username__iexact=username_or_email).first()
                if user_obj and user_obj.check_password(password):
                    user = user_obj

            if not user:
                raise serializers.ValidationError('Invalid email/username or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
        else:
            raise serializers.ValidationError('Must include email/username and password.')

        refresh = RefreshToken.for_user(user)

        return {
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
class CategorySerializer(serializers.ModelSerializer):
    staff_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'staff_count', 'created_at']

    def get_staff_count(self, obj):
        return obj.staff_members.count()

class StaffSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Staff
        fields = ['id', 'name', 'email', 'phone', 'category', 'category_name', 'role', 'status', 'created_at']
