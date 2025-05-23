// Import react
import { useEffect,useState } from "react";

// Import Router
import { useNavigate } from "react-router";

// Import Components
import Input from "../Components/Elements/Input/Input";
import InputRadio from "../Components/Elements/Input/InputRadio";

// Import Auth
import { UserAuth } from "../Services/Auth/AuthContext";

// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";


// Import Lucide
import { MoveRight } from "lucide-react";


const RegisterPage = () => {
  // User Auth Context
  const { user} = UserAuth();

//   Input Role
// role -> untuk di kirim ke db
  const [role, setRole] = useState("");
  const onChange = (value) => {
    setRole(value);
  };

//   Next animation
  const [showNext, setShowNext] = useState(false);

//   Implement handle submit
//   const navigate = useNavigate();
//   const handleSubmit = () => {
//     if (role === "Pembeli") {
//       navigate("/register-pembeli");
//     } else if (role === "Penjual") {
//       navigate("/register-penjual");
//     }
//   };

  
  return (
    <>
      <div className="h-[900px] flex items-center justify-center flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          onAnimationComplete={() => setShowNext(true)}
        >
          <h1 className="font-bold text-5xl">
            Selamat datang,{" "}
            <span className="text-green-800">{user?.displayName}</span>
          </h1>
        </motion.div>

        {/* Input Role */}
        {showNext && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative top-15 flex flex-col items-center gap-5"
          >
            <div className="flex flex-col gap-3 ">
              <label htmlFor="role" className="font-semibold text-center">
                Anda Mendaftar Sebagai :
              </label>
              <select
                id="role"
                name="role"
                className="border border-gray-300 rounded-md px-2 py-3 w-[500px] font-inter cursor-pointer"
                onChange={setRole}
                required
              >
                <option value="Pembeli">Pembeli</option>
                <option value="Penjual">Penjual</option>
              </select>
            </div>

            {/* Submit Button */}

            <button className="bg-green-800 text-white py-3 px-4 rounded mt-4 cursor-pointer rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 hover:gap-4 transition-all duration-300">
              Lanjutkan
              <MoveRight />
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default RegisterPage;
