// Import React
import { useState, useEffect } from "react";

// Components
import Navbar from "../Components/Fragments/Navbar/Navbar";

// Import Auth
import { UserAuth } from "../Services/Auth/AuthContext";

// Import Hooks
import usePut from "../Services/Hooks/customPut";
import useFetch from "../Services/Hooks/customFetch";

// Import Toast
import { toast } from "react-toastify";

const Akun = () => {
  // Current User
  const { user } = UserAuth();

  // Inisialisasi state
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const uid_pembeli = user?.uid;

  // Fetch Hooks
  const fetchData = useFetch(
    `${import.meta.env.VITE_API_URL}/pembeli/profil/${uid_pembeli}`
  );

  // Update Hooks
  const updateData = usePut(
    `${import.meta.env.VITE_API_URL}/pembeli/${uid_pembeli}`
  );

  // Set Data From Response
  useEffect(() => {
    if (fetchData.response?.status === 200) {
      setUsername(fetchData.response.data.username_pembeli || "");
      setName(fetchData.response.data.nama_pembeli || "");
      setEmail(fetchData.response.data.email_pembeli || "");
      setPhone(fetchData.response.data.nomor_handphone || "");
      setRole(fetchData.response.data.role || "");
      setImage(fetchData.response.data.gambar_profil);
    }
  }, [fetchData.response]);

  // Submit Update Data
  const handleUpdateData = (e) => {
    e.preventDefault();

    updateData.putData({
      username_pembeli: username,
      nama_pembeli: name,
      email_pembeli: email,
      nomor_handphone: phone,
    });
  };

  // Memantau Response Dari Update Data
  useEffect(() => {
    if (!updateData.response) return;
    if (updateData.response?.status === 200) {
      toast.success("Data Berhasil Diubah", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error("Data Gagal Diubah", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log(updateData.response);
    }
  }, [updateData.response]);



  return (
    <>
      {/* Navbar */}
      <div>
        <Navbar />
      </div>

      {/* User Profile */}

      {/* Header */}
      <div className="px-[5%] py-[150px]">
        <div>
          <div>
            <h1 className="font-bold text-3xl">Profil Anda</h1>
            <p>Anda dapat mengubah dan mengatur informasi akun Anda</p>
          </div>
          <div className="w-full h-[2px] bg-[#D9D9D9] mt-2"></div>
        </div>

        {/* Content */}
        <div>
          {/* Image */}
          <div className="flex flex-col gap-2 justify-center items-center mt-10">
            <img
              src={
                image
                  ? image
                  : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fno-image-available&psig=AOvVaw1n1cozLRZDWDKJWzBxChjG&ust=1748483291995000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiW5v2FxY0DFQAAAAAdAAAAABAE"
              }
              alt="Profile"
              className="w-[200px] h-[200px] rounded-full object-cover border-3 border-green-700"
            />
            <p className="cursor-pointer hover:text-green-800">
              Ubah Gambar Profil
            </p>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleUpdateData} className="flex flex-col gap-7">
              {/* Role */}
              <div className="flex flex-col">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  placeholder="pembeli"
                  value={role || "Pembeli"}
                  readOnly
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Username */}
              <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="mustafamadjid"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Nama */}
              <div className="flex flex-col">
                <label htmlFor="name">Nama</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Athaullah Mustafa Madjid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="ZBq6D@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Nomor Telepon */}
              <div className="flex flex-col">
                <label htmlFor="phone">Nomor Telepon</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Tombol Simpan/Update */}
              <button
                type="submit"
                className="cursor-pointer w-full py-2 bg-green-800 hover:bg-green-900 text-white font-semibold rounded-xl mt-2 shadow transition duration-150"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Akun;
