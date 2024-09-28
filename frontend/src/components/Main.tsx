import { FC } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie'

const Main: FC = () => {
  const navigate = useNavigate()
  const [cookies] = useCookies(['access_token'])
  
  async function handleClick(){
    console.log("Handle click triggered");
    navigate("/api/auth/login");
  }

  console.log(cookies.access_token);
  if (!cookies.access_token)
    return (
      <div style={{marginTop:"10vh"}}>
        <h1>Log in</h1>
        <button className="btn btn-primary" onClick={handleClick}>
          Log in with FireFly-III
        </button>
      </div>
    );
  
  return (
    <>
      <nav>
        <Link to={`categories`}>Categories</Link>
      </nav>
      <Outlet />
    </>
  );
}

export default Main;
