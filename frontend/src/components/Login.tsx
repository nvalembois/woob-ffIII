import { FC, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { useConfig } from '../utils/configLoader';
import { createApiUrlWithParams } from '../api/FFIIIApi'

const Login: FC = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState("")
  const [, setCookie] = useCookies(['access_token'], {doNotParse: true})
  const { config } = useConfig();

  async function handleClick(){
    if (!config || !config.apiUrl) return;
    console.log(config)
    if (!config.apiUrl) return;
    console.log(config.apiUrl)
    console.log(createApiUrlWithParams({ apiUrl: "https://firefly.local" }, "/api/v1/about/user"))
    fetch(
      createApiUrlWithParams({ apiUrl: "https://firefly.local" }, "/api/v1/about/user"), 
      { headers: {Authorization: `Bearer ${token}`, mode: 'cors'} }
    ).then((response) => {
      console.log(response)
      setCookie("access_token", token)
      navigate('/secure')
    }).catch((error) => {
      console.log(error)
    });
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
      <div>Token: {token}</div>
    </div>
  );
}

export default Login;
