import { useEffect } from "react"
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useCookies } from 'react-cookie'

export default function Secure() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token'], {doNotParse: true})
  useEffect(() => {
    if (!cookies.access_token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <nav>
        <Link to={`categories`}>Categories</Link>
      </nav>
      <Outlet />
    </>
  );
}