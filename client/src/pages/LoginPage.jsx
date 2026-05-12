import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';
import './LoginPage.css'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio});
  }

  return (
    <div className='login-page'>

      {/* ------- left ------- */}
      <img src={assets.logo_big} alt="" className='login-logo' />

      {/* ------- right ------- */}
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2 className='login-form-title'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='login-arrow-icon' />}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input type="text" onChange={(e)=>setFullName(e.target.value)} value={fullName}
          className='login-input' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
          <input onChange={(e) =>setEmail(e.target.value)} value={email}
          type="email" placeholder='Email Address' required
          className='login-input'
          />
          <input onChange={(e) =>setPassword(e.target.value)} value={password}
          type="password" placeholder='Password' required
          className='login-input'
          />
          </>
        )}

        {
          currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} placeholder='provide a short bio...'
            className='login-textarea'></textarea>
          )
        }

        <button type='submit' className='login-button'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='login-terms'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='login-switch'>
          {currState === "Sign up" ? (
            <p className='login-switch-text'>Already have an account? 
              <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false);}} className='login-switch-link'>Login here</span>
            </p>
          ) : (
            <p className='login-switch-text'>Create an account 
              <span onClick={()=>{setCurrState("Sign up")}} className='login-switch-link'>Click here</span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage