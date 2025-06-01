// Import React
import { useEffect, useState } from "react";

// Import Redux
import { useSelector } from "react-redux";

// Import Hooks
import useFetch from "../Services/Hooks/customFetch";

// Auth
import { UserAuth } from "../Services/Auth/AuthContext";

// Import Components
import Navbar from "../Components/Fragments/Navbar/Navbar";

const PesananPage = () => {
  // Current User
  const { user } = UserAuth();

  // State untuk pesanan
  const [pesanan, setPesanan] = useState([]);

  // State data user
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // URL
  const [pesananUrl, setPesananUrl] = useState("");
  const [userUrl,setUserUrl] = useState("");

  // UID
  const uid_user = user?.uid;

  // URL Pesanan
  // const url = `${import.meta.env.VITE_API_URL}/pesanan/pembeli/${uidPembeli}`;

  // Get role
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setRole(role);
    }
  }, []);

  // Set URL by role
  useEffect(() => {
    if (role === "Penjual") {
      setPesananUrl(`${import.meta.env.VITE_API_URL}/pesanan/penjual/${uid_user}`);
      setUserUrl(`${import.meta.env.VITE_API_URL}/penjual/profil/${uid_user}`);
    } else if (role === "Pembeli") {
      setPesananUrl(`${import.meta.env.VITE_API_URL}/pesanan/pembeli/${uid_user}`);
      setUserUrl(`${import.meta.env.VITE_API_URL}/pembeli/profil/${uid_user}`);
    }
  }, [role, uid_user]);

  // Fetch pesanan 
  const pesananFetch = useFetch(pesananUrl);

  // Fetch user
  const userFetch = useFetch(userUrl);

  // Mengambil dan menyimpan data pesanan ke state
  useEffect(() => {
    console.log(pesananFetch.response);
    if (pesananFetch.response?.status === 200) {
      setPesanan(pesananFetch.response?.data);
    }
  }, [pesananFetch.response?.data]);

  // Mengambil dan menyimpan data pembeli ke state
  useEffect(() => {
    if (role === "Pembeli") {
      if (userFetch.response?.status === 200 && userFetch.response?.data) {
        setUsername(userFetch.response?.data.username_pembeli || "");
        setName(userFetch.response?.data.nama_pembeli || "");
        setEmail(userFetch.response?.data.email_pembeli || "");
      }
    } else if (role === "Penjual") {
      if (userFetch.response?.status === 200 && userFetch.response?.data) {
        setUsername(userFetch.response?.data.username_penjual || "");
        setName(userFetch.response?.data.nama_penjual || "");
        setEmail(userFetch.response?.data.email_penjual || "");
      }
    }
   
  }, [userFetch.response?.data]);

  return (
    <>
      <Navbar />

      <div className="padding-nav mt-20">
        {pesanan.length > 0 ? (
          pesanan.map((pesanan, index) => (
            <>
              {/* Header */}
              <div key={index} className="mb-10">
                <h1 className="font-bold text-3xl text-green-800">
                  Pesanan {index + 1} Diproses
                </h1>
                <div className="mt-2 w-full h-1 bg-green-800 rounded"></div>
              </div>

              {/* Status Pengiriman */}
              <div className="p-5 bg-green-100 rounded-lg shadow-md mb-10">
                <h1 className="text-xl font-bold text-green-800">
                  Status Pengiriman
                </h1>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  Pesanan Dalam Pengiriman
                </p>
              </div>

              {/* Detail Pembayaran */}
              <div className="p-5 bg-gray-100 rounded-lg shadow-md mb-10">
                <h1 className="text-2xl font-bold mb-5 text-green-800">
                  Detail Pembayaran
                </h1>
                <div className="space-y-4">
                  {[
                    { label: "Nama", value: name },
                    { label: "Username", value: username },
                    { label: "Email", value: email },

                    { label: "Alamat", value: pesanan.alamat },
                    { label: "Kota", value: pesanan.kota },
                    { label: "Kode Pos", value: pesanan.kode_pos },
                    { label: "Telepon", value: pesanan.nomor_handphone },
                    {
                      label: "Tanggal Pemesanan",
                      value: pesanan.tanggal_pesanan,
                    },
                    {
                      label: "Metode Pembayaran",
                      value: pesanan.metode_pembayaran,
                    },
                  ].map((detail, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xl font-semibold">
                        {detail.label}:
                      </span>
                      <span className="text-xl font-normal">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Harga */}
              <div className="p-5 bg-gray-100 rounded-lg shadow-md mb-20">
                <h1 className="text-2xl font-bold mb-5 text-green-800">
                  Total Dibayarkan
                </h1>
                <div className="mt-10 flex justify-end">
                  <h1 className="text-xl font-bold text-green-800">
                    Total Harga:{" "}
                    {pesanan.jumlah_pesanan.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </h1>
                </div>
              </div>
            </>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-xl font-bold text-red-600 mb-4">
              Tidak Ada Pesanan
            </h1>
            <p className="text-lg text-gray-600">
              Anda belum melakukan pesanan. Silakan kembali ke halaman produk
              untuk berbelanja.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PesananPage;
