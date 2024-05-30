import React from 'react'
import './SignIn.css'
import Icon from '../../../../assets/Icon/icons'
import { assets } from '../../../../assets/assets'

const SignIn = (props) => {
    function handleSignUpClick() {
        props.setIsLogin(false)
      }
  return (
    <div className='signin-container'>
        <div className='signin-header'>
            <h1>Sign In</h1>
            <p>Welcome back! Sign in to access your account and dive into the world of gaming excitement.</p>
        </div>
        <div className='signin-input-section'>
            <div className='signin-input'>
                <Icon name='at' className='signin-icon'/>
                <input placeholder='User Name' type='text'/>
            </div>
            <div className='signin-password'>
                <div className='signin-input'>
                    <Icon name='lock' className='signin-icon'/>
                    <input placeholder='User Name' type='text'/>
                </div>
                <Icon name='lock' className='signin-icon'/>
            </div>
        </div>
        <div className='signin-submit-section'>
            <button>Sign In</button>
        </div>
        <div className='signin-sep'>
            <div className='signin-sep-s'></div>
            <div>Or</div>
            <div className='signin-sep-s'></div>
        </div>
        <div className='school_auth'>
            <img src={assets.SchoolIcon}/>
        </div>
        <div className='sigin-text-bottom'>
            <p>Don’t have an account ? <span onClick={handleSignUpClick}>Sign Up here</span></p>
        </div>
    </div>
  )
}

export default SignIn