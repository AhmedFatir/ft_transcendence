from .models import User
from rest_framework import serializers
from user_management.serializers import PlayerSerializer
from user_management.models import Player
from django.contrib.auth.password_validation import validate_password

def user_avatar_upload_path(instance, filename):
    return f"player/{instance.id}/user_avatar/{filename}"


# class UserSerializer(serializers.ModelSerializer):
#     pass
    # confirm_password = serializers.CharField(style = {'input_type': 'password'},write_only=True)
    # avatar = serializers.ImageField(allow_empty_file=False, write_only=True)

    # class Meta:
    #     model = User
    #     fields = ["id", "avatar", "username", "email" ,"password", "confirm_password"]
    #     extra_kwargs = {"password": {"write_only": True}}

    # def create(self, validated_data):
    #     avatar = validated_data.pop('avatar')
    #     confirm_password = validated_data.pop('confirm_password')

    #     password = self.validated_data['password']

    #     if(password != confirm_password):
    #         raise serializers.ValidationError({'password': 'Passwords must match.'})
        
    #     user = User.objects.create_user(**validated_data)
    #     Player.objects.create(user=user, avatar=avatar)
    #     return user


class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['avatar', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {"password": {"write_only": True}}
    
    def validate(self, data):
        if(data['password'] != data['confirm_password']):
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        return data

    def create(self, validated_data):
        confirm_password = validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
        