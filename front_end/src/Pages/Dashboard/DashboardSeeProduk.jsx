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

      {/* Sidebar */}
      <Sidebar
        lihatProdukVariant="font-bold"
      />
    </>
  );
};

export default DashboardLihatProduk;
