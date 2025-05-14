// Components
import Navbar from "../Components/Fragments/Navbar/Navbar";

const Akun = () => {
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
          {/* Image*/}
          <div className="flex flex-col gap-2 justify-center items-center mt-10">
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQHVUXJhbor6cg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1702872796344?e=1752710400&v=beta&t=BAGLToB_-g1axKLzo1HRizk6iTa8vyWG5QUOrNUBrqE"
              alt="Profile"
              className="w-[200px] h-[200px] rounded-full object-cover border-3 border-green-700"
            />
            <p className="cursor-pointer hover:text-green-800">
              Ubah Gambar Profil
            </p>
          </div>

          {/* Form */}
          <div className="">
            <form action="" className="flex flex-col gap-7">
              {/* Role */}
              <div className="flex flex-col">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  placeholder="pembeli"
                  value="Pembeli"
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
                  value="mustafamadjid"
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
                  value="Athaullah Mustafa Madjid"
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
                  value="ZBq6D@example.com"
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
                  value="08123456789"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="flex flex-col">
                <label htmlFor="jeniskelamin">Jenis Kelamin</label>
                <input
                  type="text"
                  id="jeniskelamin"
                  placeholder="Pria"
                  value="Pria"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Akun;
