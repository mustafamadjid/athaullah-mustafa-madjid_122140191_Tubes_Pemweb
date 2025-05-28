
// Import Router
import { Link } from "react-router";

// Import Lucide
import { LayoutDashboard } from "lucide-react";

const Sidebar = ({profilVariant,addProdukVariant,lihatProdukVariant}) => {
    return (
      <>
        {/* Wrapper */}
        <div className="flex py-[105px] h-screen ">
          {/* Sidebar */}
          <div className="bg-green-800 h-screen flex flex-col gap-20 px-12 py-10 rounded-r-lg text-white">
            <h1 className="font-bold text-3xl flex gap-3 items-center">
              <LayoutDashboard />
              Dashboard
            </h1>

            {/* Menu */}
            <div className="flex flex-col gap-10">
              <div
                className={`${profilVariant} text-xl  hover:font-semibold transition-all duration-100`}
              >
                <Link to="/dashboard/profil">Profil Anda</Link>
              </div>
              <div
                className={`${addProdukVariant} text-xl  hover:font-semibold transition-all duration-100`}
              >
                <Link to="/dashboard/tambahproduk">Tambahkan Produk</Link>
              </div>
              <div
                className={`${lihatProdukVariant} text-xl hover:font-semibold transition-all duration-100`}
              >
                <Link to="/dashboard/lihatproduk">Produk Anda</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Sidebar;