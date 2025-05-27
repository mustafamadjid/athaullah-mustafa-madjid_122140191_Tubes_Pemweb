// Import React
import { useEffect } from "react";

// Import Components
import Navbar from "../Components/Fragments/Navbar/Navbar";

// Import Router
import { useNavigate } from "react-router";

// Auth
import { UserAuth } from "../Services/Auth/AuthContext";

// Google Button
import GoogleButton from "react-google-button";

// Auth Service
import useFetch from "../Services/Hooks/customFetch";

const LoginPage = () => {
  const fetchPenjual = useFetch(`${import.meta.env.VITE_API_URL}/penjual`);
  const fetchPembeli = useFetch(`${import.meta.env.VITE_API_URL}/pembeli`);


  // Auth Hook
  const { googleSignIn, user } = UserAuth();

  const getPembeliUid = useFetch(
    `${import.meta.env.VITE_API_URL}/pembeli/profil/${user?.uid}`
  );

  const getPenjualUid = useFetch(
    `${import.meta.env.VITE_API_URL}/penjual/profil/${user?.uid}`
  );

  // Navigate
  const navigate = useNavigate();

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  // Redirect after logged in
  useEffect(() => {
    if (!user || !fetchPenjual.response || !fetchPembeli.response) return;

    const checkPenjualExist = fetchPenjual.response?.data?.some(
      (penjual) => penjual.uid_penjual === user.uid
    );

    const checkPembeliExist = fetchPembeli.response?.data?.some(
      (pembeli) => pembeli.uid_pembeli === user.uid
    );

    if (checkPenjualExist) {
      // Ambil data penjual yang cocok
      const penjual = fetchPenjual.response.data?.find((p) => p.uid_penjual === user.uid);
      
      localStorage.setItem("role", penjual.role);
      localStorage.setItem("uid", penjual.uid_penjual);
      navigate("/dashboard/profil");
    } else if (checkPembeliExist) {
      // Ambil data pembeli yang cocok
      const pembeli = fetchPembeli.response.data?.find((p) => p.uid_pembeli === user.uid);
      
      localStorage.setItem("role", pembeli.role);
      localStorage.setItem("uid", pembeli.uid_pembeli);
      navigate("/");
    }else{
      navigate("/register");
    }
  }, [user, fetchPenjual.response, fetchPembeli.response, navigate]);

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="flex items-center justify-center h-100">
        <GoogleButton type="dark" onClick={handleGoogleSignIn} />
      </div>
    </>
  );
};

export default LoginPage;
