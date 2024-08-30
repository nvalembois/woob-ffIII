import { FC, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie'

const Login: FC = () => {
    const navigate = useNavigate()
  const [token, setToken] = useState("")
  const [, setCookie] = useCookies(['access_token'], {doNotParse: true})

  async function handleClick(){
    try {
      await fetch(
        "/api/v1/about/user" , { headers: {Authorization: `Bearer ${token}`, mode: 'cors'} }
      );
      setCookie("access_token", token)
      navigate('/secure')
    } catch (error) {
      console.log(error)
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
      <div>Token: {token}</div>
    </div>
  );
}

export default Login;
