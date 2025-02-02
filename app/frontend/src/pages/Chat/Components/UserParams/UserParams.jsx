import React, { useContext, useEffect, useState } from 'react'
import style from './UserParams.module.css'
import {Phone, VideoCamera } from 'phosphor-react'
import Icon from '../../../../assets/Icon/icons.js'
import { useNavigate } from 'react-router-dom';
import { chatPartnerContext } from '../../Chat.jsx';
import { SuccessToast } from '../../../../components/ReactToastify/SuccessToast.js';
import { ErrorToast } from '../../../../components/ReactToastify/ErrorToast.js';
import useAuth from '../../../../hooks/useAuth.js';
import { ProfileContext } from '../../../../context/ProfilContext.js';
import { useGetBlockDetails } from '../../usehooks/GetBlockDetails.jsx';
import { createSendInvitationHandler } from '../../../../tools/createSendInvitationHandler.js';
import { useTranslation } from 'react-i18next'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserParams = () => {
  const { auth } = useAuth();
  const {ChatPartner} = useContext(chatPartnerContext);
  const navigate = useNavigate();
  const handleSendInvitation = createSendInvitationHandler(auth);
  const { t } = useTranslation();



  const { blockRelation, setblockRelation } = useGetBlockDetails(ChatPartner, auth);
    
    function handleVisiteProfil(){
      if (ChatPartner)
        navigate(`/user/${ChatPartner?.username}`, {
          state: { userData: ChatPartner },
        });
    }

    const handleInviteToGame = async () => {
      if (blockRelation) return;
      try {
        const response = await handleSendInvitation(ChatPartner.id);
        if (response.exist) {
          return;
        } else {
          navigate('/invite-game', { replace:true });
        }
      } catch (error) {
        // console.log(error);
      }
    }

    const  handleBlocking =  async() =>{
      const url = `${BACKEND_URL}/api/user/${ChatPartner.id}/block-unblock/`; 
      try {
        const response = await fetch(url, {
          method : 'POST',
          headers :{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`,
          }
        })
        if (response.ok){
          SuccessToast(t(`User has been blocked successfully.`));
          // setblockRelation(true)
          
        }else {
          const data = await response.json();
          ErrorToast(`Error : ${data.error}`)
        }
      }
      catch(e){
        ErrorToast(`Error : ${e.error}`)
      }
}

  return (
    <div className={style.UserParams}>
            <div className={style.visiteProfilBack} onClick={handleVisiteProfil}>
            <Icon name='VisiteProfil' className={style.visiteProfil} />
            </div>

            <div className={ !blockRelation ? style.InviteToGameBack : style.InviteToGameBackInactif  } onClick={handleInviteToGame}>
            <Icon name='InviteToGame' className={style.InviteToGame} />
            </div>

            <div className={ style.BlockBack } onClick={handleBlocking}>
            <Icon name='Block' className={style.Block} />
            </div>

    </div>
  )
}

export default UserParams