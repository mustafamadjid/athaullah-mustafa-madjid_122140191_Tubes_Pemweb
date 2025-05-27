import { useEffect } from "react";
import { useNavigate } from "react-router";

const ProtectedRouteLoggedIn = ({ children }) => {
    const getRole = localStorage.getItem("role");
    const getUid = localStorage.getItem("uid");

    const navigate = useNavigate();
    useEffect(() => {
      if (getRole && getUid) {
        navigate("/s");
      }
    }, [getRole, getUid, navigate]);

    return children;
};

export default ProtectedRouteLoggedIn;