// import React
import { useEffect, useState } from "react";

// Import Components
import Navbar from "../../Components/Fragments/Navbar/Navbar";
import Sidebar from "../../Components/Fragments/Sidebar/Sidebar";
import CardPenjual from "../../Components/Fragments/CardProduct/CardPenjual";

// Import Router
import { Link } from "react-router";

// Import Hooks
import useFetch from "../../Services/Hooks/customFetch";
import usePut from "../../Services/Hooks/customPut";

// Import Toast
import { toast } from "react-toastify";

// Auth Service
import { UserAuth } from "../../Services/Auth/AuthContext";

const DashboardLihatProduk = () => {
  // Current User
  const { user } = UserAuth();

  // Inisialisasi state untuk produk
  const [produk, setProduk] = useState();

  // UID Penjual
  const uid_penjual = user?.uid;

  // Fetch produk Hooks
  const { response, error, loading } = useFetch(
    `${import.meta.env.VITE_API_URL}/produk/penjual/${uid_penjual}`
  );

  // Mengambil dan menyimpan data produk ke state
  useEffect(() => {
   
    if (response?.status === 200) {
      setProduk(response?.data);
    }
  }, [response?.data]);

  // Mengambil dan menyimpan data foto produk ke state

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="h-[100vh]  flex gap-10">
        {/* Sidebar */}
        <Sidebar lihatProdukVariant="font-bold" />

        {/* List Produk */}
        {produk?.length > 0 ? (
          <div className="ml-20 mt-30 w-full h-full flex flex-row  flex-wrap gap-16 overflow-scroll pb-6">
            {produk?.map((produk) => {
              return (
                <CardPenjual
                  idProduk={`${produk.id_produk}`}
                  namaProduk={`${produk.nama_produk}`}
                  merkProduk={produk.merk_produk}
                  hargaProduk={produk.harga_produk}
                  deskripsiProduk={produk.deskripsi_produk}
                  stokProduk={produk.stok_produk}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center gap-5">
            <h1 className="font-bold text-3xl">Produk Anda Kosong</h1>
            <Link to="/dashboard/tambahproduk">
              <button className="cursor-pointer bg-green-700 text-white py-2 px-4 rounded-lg">
                Tambahkan Produk
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardLihatProduk;
