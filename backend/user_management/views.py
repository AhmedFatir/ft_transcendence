from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from .models import Friendship, Player
from .serializers import PlayerSerializer, FriendshipSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class CreateFriendshipView(APIView):
    def post(self, request, player_id, friend_id):
        player = Player.objects.get(id=player_id)
        friend = Player.objects.get(id=friend_id)
        
        friendship = Friendship(player=player, friend=friend)
        
        try:
            friendship.full_clean()  
            friendship.save()
            return Response({"message": "Friendship created successfully."}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeleteFriendshipView(APIView):

    def delete(self, request, player_id, friend_id):
        try:
            friendship = Friendship.objects.get(player_id=player_id, friend_id=friend_id)
            reverse_friendship = Friendship.objects.get(player_id=friend_id, friend_id=player_id)
            
            friendship.delete()
            reverse_friendship.delete()
            
            return Response({"message": "Friendship deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Friendship.DoesNotExist:
            return Response({"error": "Friendship does not exist."}, status=status.HTTP_404_NOT_FOUND)
             
class FriendsListView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        player_id = self.kwargs['player_id']  
        return Friendship.objects.filter(player_id=player_id)

class BlockFriendView(APIView):
    def post(self, request, player_id, friend_id):
        player = get_object_or_404(Player, id=player_id)
        friend = get_object_or_404(Player, id=friend_id)
        try:
            friendship = Friendship.objects.get(player=player, friend=friend)
            friendship.blocked = True
            friendship.save()
            return Response({'status': 'friend blocked'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({'error': 'friendship does not exist'}, status=status.HTTP_404_NOT_FOUND)
        

class UnblockFriendView(APIView):
    def post(self, request,player_id, friend_id):
        player = get_object_or_404(Player, id=player_id)
        friend = get_object_or_404(Player, id=friend_id)
        try:
            friendship = Friendship.objects.get(player=player, friend=friend)
            friendship.blocked = False
            friendship.save()
            return Response({'status': 'friend unblocked'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({'error': 'friendship does not exist'}, status=status.HTTP_404_NOT_FOUND)