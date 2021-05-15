from .models import CustomUser, SubscriptionCode
from rest_framework import serializers

"""
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'id']
"""

class SubscriptionCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionCode
        fields = ['id', 'code', 'payment_amount', 'expiration_date']

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True, 
        required=True
    )
    
    subscription_code = SubscriptionCodeSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email', 'is_superuser', 'subscription_code')
    
    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_password(self, value):
        return value
