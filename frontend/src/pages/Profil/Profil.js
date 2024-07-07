import React, { useEffect, useState } from 'react'
import './profil.css'
import DashProfil from './components/DashProfil'
import MatchHistory from './components/MatchHistory'
import Achievments from './components/Achievments'
import Friends from './components/Friends'
import useFetch from '../../hooks/useFetch'
import Icon from '../../assets/Icon/icons'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'

const Profil = () => {
  const { userId } = useParams();
  const [profilData, setProfilData] = useState([]);
  const navigate = useNavigate();
  const { auth }  = useAuth()
  const {data ,isLoading, error} = useFetch('http://localhost:8000/auth/user/me/4')

  const handleAddFriend = async () => {
    const url = `http://localhost:8000/user_management/friends/create/2/`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Friend created:', data);
    } catch (error) {
      console.error('Error creating friend:', error);
    }
  };

  useEffect(() => {
    if (data) {
      setProfilData(data);
    }
  }, [data]);

  const handleItemClick = () => {
    navigate(`/chat`);
  };

  return (
    <div className='dashboard-contianer'>
       <div className='profil-icons'>
          <div className='profil-buttons'>
            <div className='AddFriend-button profil-button' onClick={handleAddFriend}>
                <Icon name='AddFriend' className='Add-Friend profil-icon' />
                <p>add Friend</p>
            </div>
            <div className='ChatFriend-button profil-button' onClick={() => handleItemClick()}>
                <Icon name='ChatFriend' className='Chat-Friend profil-icon' />
                <p>Message</p>
            </div>
            <div className='Challangefriend-button profil-button'>
                <Icon name='Challangefriend' className='Challange-friend profil-icon' />
                <p>Challange</p>
                
            </div>
            <div className='BlockFriend-button profil-button'>
                <Icon name='BlockFriend' className='Block-Friend profil-icon' />
                <p>Block</p>
            </div>
        </div>
       </div>
       <div className="dashboard-profil">
          <div className="profilHistoryAcgievmeants-container-profil">
              <div className="profil-container-profil">
                <DashProfil profil={profilData}/>
              </div>
              <div className="historyAchievments-container-profil">
                <div className="history-container-profil">
                <MatchHistory /> 
                </div>
                <div className="achievments-container-profil">
                <Achievments />
                </div>
              </div>
          </div>
       </div>

    </div>
  )
}

export default Profil