import React from 'react'
import  { useState, useEffect } from 'react';
import './dashProfil.css'
import { avatars } from '../../../assets/assets'

function DashProfil({profil}) {
  const [progress, setProgress] = useState('0%');

  useEffect(() => {
      setTimeout(() => {
        setProgress('67%');
      }, 100); 
    }, []);

  return (
    <div className='profilInfo'>
      
        <div className="userInfo">
            <div className='userContainer'>
                <div className="userImage" >
                    <img src={avatars[0].img}/>
                </div>
                <div className="userProgress">
                    <div className="progresInfo">
                        <div className="nameRank">
                            <h4>{profil.username}</h4>
                            <h4>Rank : Gold</h4>
                        </div>
                        <div className="totalGames box">
                            <p>Total Games</p>
                            <p>123</p>
                        </div>
                        <div className="win box">
                            <p>Win</p>
                            <p>12%</p>
                        </div>
                        <div className="Loss box">
                            <p>Loss</p>
                            <p>22%</p>
                        </div>
                    </div>
                    <div className="progresBar">
                        <div className='emptyBar'>
                            <p>67%</p>
                            <div className='filledBar' style={{ width: progress }}></div>
                        </div>
                    </div>
            </div>
            </div>
        </div>

    </div>
  )
}

export default DashProfil