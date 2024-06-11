from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from user_management.models import Player

class GameHistory(models.Model):
    GAME_TYPES = [
        ('pingpong', 'Ping Pong'),
        ('xo', 'XO'),
    ]
    
    MATCH_TYPES = [
        ('single', 'Single Match'),
        ('tournament', 'Tournament Match'),
    ]
    
    winner_user = models.ForeignKey(
        Player,
        related_name='won_games',
        on_delete=models.CASCADE
    )
    loser_user = models.ForeignKey(
        Player,
        related_name='lost_games',
        on_delete=models.CASCADE
    )
    winner_score = models.IntegerField()
    loser_score = models.IntegerField()
    game_type = models.CharField(max_length=20, choices=GAME_TYPES)
    match_type = models.CharField(max_length=20, choices=MATCH_TYPES)
    played_at = models.DateTimeField(auto_now_add=True)
    
    # def clean(self):
    #     if self.winner_user == self.loser_user:
    #         raise ValidationError("A player cannot play a game against themselves.")
        
    def __str__(self):
        return f"{self.winner_user} vs {self.loser_user}"