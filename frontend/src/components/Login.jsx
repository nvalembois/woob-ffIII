import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate()
  const [token, setToken] = useState("")

  var err_msg = '';
  
  async function handleClick(){
    err_msg = "1"
    try {
      await fetch(
        "/api/v1/about/user" , { headers: {Authorization: `Bearer ${token}`, mode: 'cors'} }
      );
      Cookies.set("access_token", token)
      navigate('/secure')
    } catch (error) {
      console.log(error)
      err_msg = error
    }
  }

  return (
    <div style={{marginTop:"10vh"}}>
      <h1>Log in with access token</h1>
      <div className="mb-3">
          <label htmlFor="token">Token :</label>
          <input onChange={e => {setToken(e.target.value)}} type="password" id="token" />
      </div>
      <button className="btn btn-primary" onClick={handleClick}>
        Log in with FireFly-III
      </button>
      <div>Error: {err_msg}</div>
      <div>Token: {token}</div>
    </div>
  );
}