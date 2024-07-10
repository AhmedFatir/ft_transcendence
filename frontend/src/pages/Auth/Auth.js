import React, { useState } from 'react'
import './Auth.css'
import { assets } from '../../assets/assets'
import SignUp from './Components/SignUp/SignUp'
import SignIn from './Components/SignIn/SignIn'
import { Navigate } from 'react-router-dom'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div className='auth-container'>
      <div className='auth-left-section'>
        <div className='auth-logo-container'>
          <img src={assets.logo}/>
        </div>
        <div className={`auth-content ${isLogin ? 'slide' : 'exit'}`}>
        {!isLogin ? <SignUp isLogin={isLogin} setIsLogin={setIsLogin}/> : <SignIn className={isLogin ? 'slide' : 'exit'} isLogin={isLogin} setIsLogin={setIsLogin}/>}
        </div>
      </div>
      <div className='auth-right-section'>
         {/* <img src={assets.loginBackground} />  */}
      </div>
    </div>
  )
}

export default Auth
