import React from "react";
import { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";

export default function Secure() {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
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