// Import React
import { useState } from "react";

// Import Components
import Navbar from "../../Components/Fragments/Navbar/Navbar";
import Sidebar from "../../Components/Fragments/Sidebar/Sidebar";

// Import Hooks
import useFetch from "../../Services/Hooks/customFetch";
import usePut from "../../Services/Hooks/customPut";


// Import Router
import { Link } from "react-router";
const DashboardProfil = () => {
  const [username,setUsername] = useState("");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [role,setRole] = useState("");
  const [image,setImage] = useState("");

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="flex gap-10 min-h-screen bg-green-50">
        {/* Sidebar */}
        <Sidebar profilVariant="font-bold" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-start items-center mt-33">
          {/* Header */}
          <div className="w-[480px] mb-6">
            <h1 className="font-bold text-3xl text-green-900">Profil Anda</h1>
            <p className="text-green-800">
              Anda dapat mengubah dan mengatur informasi akun Anda
            </p>
            <div className="w-full h-[2px] bg-green-200 mt-4 mb-3"></div>
          </div>

          {/* Profile Card */}
          <div className="w-[480px] bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            {/* Image */}
            <div className="flex flex-col gap-2 items-center mb-6">
              <img
                src={image}
                alt="Profile"
                className="w-[120px] h-[120px] rounded-full object-cover border-4 border-green-700"
              />
              
            </div>

            {/* Form */}
            <form className="w-full flex flex-col gap-5">
              {/* Role */}
              <div className="flex flex-col">
                <label
                  htmlFor="role"
                  className="text-green-900 font-medium mb-1"
                >
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  readOnly
                  className="border border-green-700 rounded-lg px-3 py-2 bg-green-50 text-green-900 font-semibold"
                />
              </div>
              {/* Username */}
              <div className="flex flex-col">
                <label
                  htmlFor="username"
                  className="text-green-900 font-medium mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                />
              </div>
              {/* Nama */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-green-900 font-medium mb-1"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Nama Pengguna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                />
              </div>
              {/* Email */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-green-900 font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                />
              </div>
              {/* Nomor Telepon */}
              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="text-green-900 font-medium mb-1"
                >
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Nomor Telepon"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                />
              </div>
              {/* (Optional: Tombol Simpan/Update) */}
              <button type="submit" className="cursor-pointer w-full py-2 bg-green-800 hover:bg-green-900 text-white font-semibold rounded-xl mt-2 shadow transition duration-150">
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardProfil;
