from django.shortcuts import render
from django.db import models
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import GameHistory, Achievement, UserAchievement, GameSettings, GameRoom
from .serializers import GameHistorySerializer, AchievementSerializer, UserAchievementSerializer, GameSettingsSerializer, GameRoomSerializer
from user_management.models import Player


class PlayerGameHistoryView(generics.ListAPIView):
    serializer_class = GameHistorySerializer

    def get_queryset(self):
        player_id = self.kwargs['player_id']
        return GameHistory.objects.filter(models.Q(winner_user_id=player_id) | models.Q(loser_user_id=player_id))


class AchievementListView(APIView):
    def get(self, request):
        achievements = Achievement.objects.all()
        serializer = AchievementSerializer(achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CurrentUserAchievementListView(APIView):
    permission_classes = [IsAuthenticated]  
    
    def get(self, request):
        user_achievements = UserAchievement.objects.filter(user=request.user)
        serializer = UserAchievementSerializer(user_achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SpecificUserAchievementListView(APIView):
    def get(self, request, user_id):
        user_achievements = UserAchievement.objects.filter(user_id=user_id)
        serializer = UserAchievementSerializer(user_achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TriggerAchievementView(APIView):
    def post(self, request):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "achievements_group",
            {
                "type": "send_achievement",
                "achievement": {
                    "title": "Achievement Unlocked!",
                    "description": "You have completed 5 games."
                }
            }
        )
        return Response({"status": "Achievement sent"}, status=status.HTTP_200_OK)
    
class GameSettingsView(APIView):
    def post(self, request):
        try:
            print(f"{request.data}")
            player, createdPlayer = Player.objects.get_or_create(user_id=request.user.id)
            game_settings, created = GameSettings.objects.get_or_create(user=player)
            if created:
                print("A new GameSettings instance was created.")
            else:
                print("An existing GameSettings instance was retrieved.")
            serializer = GameSettingsSerializer(instance=game_settings, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
    def get(self, request):
        try:
            player = Player.objects.get(user_id=request.user.id)
            game_settings = GameSettings.objects.get(user=player)
            serializer = GameSettingsSerializer(game_settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        except GameSettings.DoesNotExist:
            return Response({"error": "GameSettings not found"}, status=status.HTTP_404_NOT_FOUND)
        
class GameRoomView(APIView):
    def get(self, request, room_id):
        try:
            room = GameRoom.objects.get(id=room_id)
            print(f"{room.player1}")
            print(f"{room.player2}")
            serializer = GameRoomSerializer(room)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GameRoom.DoesNotExist:
            return Response({"error": "Game room not found"}, status=status.HTTP_404_NOT_FOUND)
