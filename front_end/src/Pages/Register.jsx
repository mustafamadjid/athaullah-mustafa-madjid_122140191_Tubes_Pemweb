import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // Pastikan pakai 'react-router-dom'!
import usePost from "../Services/Hooks/customPost";
import { UserAuth } from "../Services/Auth/AuthContext";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { toast } from "react-toastify";

const RegisterPage = () => {
  // Animation state
  const [showNext, setShowNext] = useState(false);

  // State untuk input form
  const [role, setRole] = useState("Pembeli"); 
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const { response, error, loading, postData } = usePost(
    role === "Pembeli"
      ? `${import.meta.env.VITE_API_URL}/pembeli`
      : `${import.meta.env.VITE_API_URL}/penjual`
  );
  const { user } = UserAuth();
  const navigate = useNavigate();

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Bentuk data sesuai role
    const data =
      role === "Pembeli"
        ? {
            uid_pembeli: user.uid,
            username_pembeli: username,
            role: "Pembeli",
            nama_pembeli: user.displayName,
            email_pembeli: user.email,
            nomor_handphone: phone,
            gambar_profil: user.photoURL,
          }
        : {
            uid_penjual: user.uid,
            username_penjual: username,
            role: "Penjual",
            nama_penjual: user.displayName,
            email_penjual: user.email,
            nomor_handphone: phone,
            gambar_profil: user.photoURL,
          };

    postData(data);
  };

  // Memantau perubahan response
  useEffect(() => {
    if (!response) return;
    if (response.status === 200) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 2000,
      });
      if (role === "Pembeli"){
        localStorage.setItem("role", "Pembeli");
        localStorage.setItem("uid", user.uid);
        setTimeout(() => navigate("/"), 2000);
      } else {
        localStorage.setItem("role", "Penjual");
        localStorage.setItem("uid", user.uid);
        setTimeout(() => navigate("/dashboard/profil"), 2000);
      };
      
    } else {
      toast.error(response.message || "Gagal daftar!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, [response, navigate]);

  return (
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
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative top-15 flex flex-col items-center gap-5"
          onSubmit={handleSubmit}
        >
          {/* Username Input */}
          <div className="flex flex-col gap-3 mb-5">
            <label htmlFor="username" className="font-semibold text-center">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="border border-gray-300 rounded-md px-2 py-3 w-[500px] font-inter"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Phone Number Input */}
          <div className="flex flex-col gap-3 mb-5">
            <label
              htmlFor="nomor_handphone"
              className="font-semibold text-center"
            >
              Nomor Handphone
            </label>
            <input
              type="text"
              id="nomor_handphone"
              name="nomor_handphone"
              className="border border-gray-300 rounded-md px-2 py-3 w-[500px] font-inter"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Role Input */}
          <div className="flex flex-col gap-3 ">
            <label htmlFor="role" className="font-semibold text-center">
              Anda Mendaftar Sebagai :
            </label>
            <select
              id="role"
              name="role"
              className="border border-gray-300 rounded-md px-2 py-3 w-[500px] font-inter cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Pembeli">Pembeli</option>
              <option value="Penjual">Penjual</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-800 text-white py-3 px-4 rounded mt-4 cursor-pointer rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 hover:gap-4 transition-all duration-300"
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                Lanjutkan <MoveRight />
              </>
            )}
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default RegisterPage;
