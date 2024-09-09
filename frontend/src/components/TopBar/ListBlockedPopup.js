import React, { useState, useContext } from 'react';
import { useEffect} from 'react';
import useAuth from '../../hooks/useAuth';
import './listBlockedPopup.css'
import ListBlockedItem from './ListBlockedItem';
import Lottie from 'lottie-react';
import sadFace from '../../assets/sadFace.json'
import { useTranslation } from 'react-i18next';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const ListBlockedPopup = ({ isOpen, onClose})=> {
    const { auth }  = useAuth()
    const [blockedUsers, setBlockedUsers] = useState([]);
    const { t } = useTranslation();


    useEffect(() => {
        const fetchRequestStatus = async () => {
            const url = `${BACKEND_URL}/user/block-unblock/`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.accessToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setBlockedUsers(data.
                        blocked_users)
                    
                }
                 else {
                    console.error('Error fetching block status:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching block status:', error);
            }
        };
        
        fetchRequestStatus();
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }
  return (
    <div className="modal-listBlocked">
      <div className="modal-blocked">
        <button className="modalCloseButton" onClick={onClose}>&times;</button>
        <h2>List Blocked</h2>
        <div className='listBlocked'>
            {blockedUsers && blockedUsers.length > 0 ? (
                blockedUsers.map((user) => (
                    <ListBlockedItem key={user.id} user={user}/>
                ))
            ) : (
                <div className='sadFaceAnimationGame'>
                    <div className='sadeFaceGame'><Lottie  animationData={sadFace} /> </div>
                    <h3>{t('No blocked users found')}</h3>
                </div>

            )}
        </div>
      </div>
    </div>
  );
};

export default ListBlockedPopup;