// Import navigate
import { use } from "react";
import { useNavigate } from "react-router";

// Import React
import { useEffect } from "react";

const ProtectedRouteLogin = ({ children }) => {
    const getRole = localStorage.getItem("role");
    const getUid = localStorage.getItem("uid");

    const navigate = useNavigate();
useEffect(() => {
    if (!getRole && !getUid) {
      navigate("/login");
    }
},[getRole, getUid, navigate]);
    
    return children;
}

export default ProtectedRouteLogin