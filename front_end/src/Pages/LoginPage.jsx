import Navbar from "../Components/Fragments/Navbar/Navbar";

const LoginPage = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="flex items-center justify-center  h-svh">
        {/* Header */}

        <button className=" flex gap-5 px-4 py-4 rounded-lg bg-slate-100 shadow-md cursor-pointer hover:bg-slate-50 text-md">
          {/* Google Icon */}
          <div>Icon</div>
          Masuk Menggunakan Akun Google
        </button>
      </div>
    </>
  );
};

export default LoginPage;
