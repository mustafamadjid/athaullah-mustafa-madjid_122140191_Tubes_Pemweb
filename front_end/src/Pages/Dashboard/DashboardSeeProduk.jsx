// Import Components
import Navbar from "../../Components/Fragments/Navbar/Navbar";
import Sidebar from "../../Components/Fragments/Sidebar/Sidebar";

// Import Router
import { Link } from "react-router";

const DashboardLihatProduk = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="min-h-screen bg-green-50 flex gap-10">
        {/* Sidebar */}
        <Sidebar lihatProdukVariant="font-bold" />

        {/* List Produk */}
        <div className="mt-27 w-4/5 flex justify-center">
          <h1 className="font-bold text-3xl">Produk yang anda jual</h1>
        </div>
      </div>
    </>
  );
};

export default DashboardLihatProduk;
