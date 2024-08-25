import React, { useContext, useState } from 'react';
import Style from './Setting.module.css';
import AvatarSelect from './components/AvatarSelect/AvatarSelect';
import SettingInput from './components/SettingInput/SettingInput';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import { SuccessToast } from '../../components/ReactToastify/SuccessToast';
import { ErrorToast } from '../../components/ReactToastify/ErrorToast';
import MainButton from '../../components/MainButton/MainButton';
import { UserContext } from '../../context/UserContext';


const SETTING_ENDPOINT = "http://127.0.0.1:8000/auth/user/me/"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const Setting = () => {
  const { auth }  = useAuth()
  const [activeAvatar, setActiveAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const { updateUserData } = useContext(UserContext);

  
  const [updatedvalues, setUpdatedvalues] = useState({
    username : "",
    email : "",
    old_password : "",
    new_password : "",
  })


  const handleTwoFaClick = (e) => {
    e.preventDefault();
    // 2FA setup logic will be added here
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    for (const key in updatedvalues) {
        if (updatedvalues[key] !== "") {
            formData.append(key, updatedvalues[key]);
        }
    }
    if (avatarFile) {
        formData.append('avatar', avatarFile);
    } else if (activeAvatar) {
        formData.append('avatar_type', activeAvatar);
    }
    
    try {
        await axios.patch(SETTING_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${auth.accessToken}`,
            }
        });
        const response = await axios.get(`${BACKEND_URL}/user/stats/`, {
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`,
            }
        });
        updateUserData(response.data);

        SuccessToast('Profile updated successfully!');
    } catch (e) {
        ErrorToast('Failed to update settings. Please try again.');
    }
};


  const handleInputChange = (e) => {
    setUpdatedvalues({ ...updatedvalues, [e.target.name]: e.target.value });
};

  return (
    <>
      <div className={Style.SettingContainer}>
        <h1>Settings</h1>
        <div className={Style.AvatarContainer}>
          <div className={Style.SettingInfo}>
            <h3>Profile Picture</h3>
            <p>Update your information about you and details here</p>
          </div>
          <div className={Style.Avatars}>
            <AvatarSelect setActiveAvatar={setActiveAvatar} setAvatarFile={setAvatarFile} activeAvatar={activeAvatar} avatarFile={avatarFile}/>
          </div>
        </div>
        <form className={Style.form} onSubmit={handleFormSubmit}>
          <div className={Style.SettingSep}>
          </div>
          <div className={Style.SettingSection}>
            <div className={Style.SettingInfo}>
              <h3>Personal Informations</h3>
              <p>Update your information about you and details here</p>
            </div>
            <div className={Style.InputSection}>
              <SettingInput label="User Name" name='username' placeholder='Perdoxii_noyat' type='text' onChange={handleInputChange} />
              <SettingInput label="Email" name='email' placeholder='perdoxi@admin.com' type='email' onChange={handleInputChange}/>
            </div>
          </div>
          <div className={Style.SettingSep}></div>
          <div className={Style.SettingSection}>
            <div className={Style.SettingInfo}>
              <h3>Security</h3>
              <p>Update your information about you and details here</p>
            </div>
            <div className={Style.InputSection}>
              <SettingInput label='Current Password' name="old_password" placeholder='********************' type='password' onChange={handleInputChange}/>
              <SettingInput label='New Password' name="new_password" placeholder='********************' type='password' onChange={handleInputChange}/>
            </div>
          </div>
          <div className={Style.SettingSep}></div>
          <div className={Style.TwoFactorContainer}>
            <div className={Style.SettingInfo}>
              <h3>Two-factor Authenticator App <span>Enabled</span></h3>
              <p>Use an Authenticator App as your two-factor authentication (2FA). When you sign in you'll be asked to use the security code provided by your Authenticator.</p>
            </div>
            <button type="button" onClick={handleTwoFaClick}>Set Up</button>
          </div>
          <MainButton type="submit" onClick={handleFormSubmit} content="Update"/>
        </form>
      </div> 
    </>
  );
}

export default Setting;










