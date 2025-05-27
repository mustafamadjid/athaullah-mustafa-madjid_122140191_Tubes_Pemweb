// Import navigate
import { useNavigate } from "react-router";

// Import React
import { useEffect } from "react";

const ProtectedRoutePenjual = ({ children }) => {
  const getRole = localStorage.getItem("role");
  const getUid = localStorage.getItem("uid");

  const navigate = useNavigate();

  useEffect(() => {
    if (!getRole && !getUid) {
      navigate("/login");
    } else if (getRole !== "Penjual") {
      navigate("/");
    }
  }, [getRole, getUid, navigate]);

  return children;
};

export default ProtectedRoutePenjual;