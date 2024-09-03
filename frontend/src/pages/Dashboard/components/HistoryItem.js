import React from 'react'
import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch';
import './historyItem.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function HistoryItem( {history} ) {


    
    let player = history.winner_user
    if (history.is_winner)
        player = history.loser_user

  


    //  const winPer = Math.floor((playerData.games_won / playerData.games_played) * 100);
     const winPer = Math.floor((30 / 100) * 100);
  return (
    <div className={history.is_winner ? "card won" : "card loss"}>
        <div className="playerImage">
            <img src={`${BACKEND_URL}${player.avatar}`} />
        </div>
        <div className="playerInfo">
            <div className="nameRank">
                <h4>{player.username}</h4>
                <p style={{color: '#737373', paddingTop:'5px'}}>Rank : {player.rank}</p>
            </div>
            <div className='playerInfoBox'>
                <div className="totalGames box">
                    <p>Total Games</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{player.games_played}</p>
                </div>
                <div className="win box">
                    <p>Win</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{winPer}%</p>
                </div>
                <div className="Loss box">
                    <p>Game</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{history.game_type}</p>
                </div>
                <div className={history.is_winner ? "defeat box true" : "defeat box false"}>
                    <p>DEFEAT</p>
                    <p className='parg clr'>{history.winner_score}:{history.loser_score}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HistoryItem