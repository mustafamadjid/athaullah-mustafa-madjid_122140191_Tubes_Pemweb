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


const LoginPage = () => {
  // Auth Hook
  const { googleSignIn, user } = UserAuth();

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
    if (user) {
      navigate("/");
    }
  }, [user]);

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
