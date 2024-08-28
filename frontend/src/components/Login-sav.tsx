import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const generateRandom = (length) => {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    array = array.map((x) => validChars.codePointAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
  };

  const config = {
    client: {
      id: '4',
      secret: ''
    },
    auth: {
      tokenHost: 'https://firefly.local/',
      tokenPath: '/oauth/token',
      authorizePath: '/oauth/authorize'
    }
  };

  const { AuthorizationCode } = require('simple-oauth2');
  const client = new AuthorizationCode(config);

  
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  var state_status = '';

  const handleClick = () => {
    const authorizationUri = client.authorizeURL({
      redirect_uri: 'http://localhost:3000/callback',
      scope: '',
      state: generateRandom(40)
    });
    res.redirect(authorizationUri);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('code')) {
      state_status = `Received code`;
      const tokenParams = {
        code: searchParams.get('code'),
        redirect_uri: window.location.origin,
        scope: '',
      };
      try {
        const accessToken = client.getToken(tokenParams);
        Cookies.set("access_token", accessToken);
        setIsLoggedin(true);
        state_status = `Access Token: ${accessToken}`;
      } catch (error) {
        state_status = `Access Token Error : ${error.message}`;
      }
    }
    if (searchParams.has('state')) {
      if (checkState(searchParams.get('state'))) {
        state_status = "ok";
      } else {
        state_status = "nok";
      }
    }

  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/secure");
    }
  }, [isLoggedin, navigate]);

  return (
    <div className="root">
      <div>
        <h1>Log in with FireFly-III</h1>
        <div className="btn-container">
          <button className="btn btn-primary" onClick={handleClick}>
            Log in with FireFly-III
          </button>
        </div>
        <h2>state_status: {state_status}</h2>
      </div>
    </div>
  );
}