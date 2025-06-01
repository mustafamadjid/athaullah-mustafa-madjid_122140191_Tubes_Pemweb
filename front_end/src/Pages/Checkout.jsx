// Import React
import { useEffect, useState } from "react";

// Import Redux
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../Services/Slice/handleCart";

// Import Router
import { data, useNavigate } from "react-router";

// Import Custom Hooks
import useFetch from "../Services/Hooks/customFetch";
import usePost from "../Services/Hooks/customPost";

// Import Auth
import { UserAuth } from "../Services/Auth/AuthContext";

// Import Components
import Navbar from "../Components/Fragments/Navbar/Navbar";
import Input from "../Components/Elements/Input/Input";
import InputRadio from "../Components/Elements/Input/InputRadio";

// Import Toast
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { user } = UserAuth();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [tanggalPesanan, setTanggalPesanan] = useState("");
  const [payment, setPayment] = useState("");

  // UID
  const uid_user = user?.uid;

  // URL
  const [url, setUrl] = useState("");


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
      setUrl(`${import.meta.env.VITE_API_URL}/penjual/profil/${uid_user}`);
    } else if (role === "Pembeli") {
      setUrl(`${import.meta.env.VITE_API_URL}/pembeli/profil/${uid_user}`);
    }
  }, [role, uid_user]);

  // Fetch data profile
  const userFetch = useFetch(url);

  // Post Data
  const pesananPost = usePost(`${import.meta.env.VITE_API_URL}/pesanan`);

  // Mengambil dan menyimpan data pembeli ke state
  useEffect(() => {
    console.log(userFetch.response?.data);
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
  }, [userFetch.response, role]);

  
  // Set Tanggal
  useEffect(() => {
    
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    setTanggalPesanan(formattedDate);
  }, []);


  // Validasi form sebelum submit
  const validateForm = () => {
    if (!alamat.trim()) {
      toast.error("Alamat lengkap wajib diisi.");
      return false;
    }
    if (!kota.trim()) {
      toast.error("Kota wajib diisi.");
      return false;
    }
    if (!kodePos.trim()) {
      toast.error("Kode pos wajib diisi.");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Nomor telepon wajib diisi.");
      return false;
    }
    if (!payment) {
      toast.error("Metode pembayaran wajib dipilih.");
      return false;
    }
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Format email tidak valid.");
      return false;
    }
    return true;
  };

  // Handle Checkout
  const handleCheckout = (e) => {
    e.preventDefault();

    if (!validateForm()) return;  
    // Data untuk submit
    const data =
      role === "Pembeli"
        ? {
            uid_pembeli: user.uid,
            metode_pembayaran: payment,
            alamat: alamat,
            kode_pos: kodePos,
            kota: kota,
            nomor_handphone: phone,
            jumlah_pesanan:cart.cartTotalPrice,
            status_pesanan: "aktif",
            tanggal_pesanan: tanggalPesanan,
          }
        : {
            uid_penjual: user.uid,
            metode_pembayaran: payment,
            alamat: alamat,
            kode_pos: kodePos,
            kota: kota,
            nomor_handphone: phone,
            jumlah_pesanan:cart.cartTotalPrice,
            status_pesanan: "aktif",
            tanggal_pesanan: tanggalPesanan,
          };
    pesananPost.postData(data);
  };

  // Validasi Response
  useEffect(() => {
    console.log(data);
    console.log(pesananPost.response);
    if (pesananPost.response?.status === 200) {
      
      toast.success("Pesanan Berhasil Dibuat", {
        position: "top-right",
        autoClose: 1700,
      });

      dispatch(clearCart());

      setTimeout(() => {
        navigate("/pesanan");
      }, 1500);
    }
  }, [pesananPost.response]);

  return (
    <>
      <Navbar />
      <div className="padding-nav mt-30 flex flex-col gap-10 md:flex-row">
        <div className="w-full md:w-1/2">
          <h1 className="font-bold text-xl md:text-3xl">
            Informasi Pembayaran
          </h1>
          <div className="p-4 md:p-5 rounded-sm mt-5 bg-white shadow-md">
            <form onSubmit={handleCheckout}>
              <Input
                type="text"
                placeholder="username"
                name="username"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                readOnly
              />
              <Input
                type="text"
                placeholder="Nama Lengkap"
                name="nama"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                readOnly
              />
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
              <Input
                type="text"
                placeholder="Alamat Lengkap"
                name="address"
                value={alamat || ""}
                onChange={(e) => setAlamat(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Kota"
                name="kota"
                value={kota || ""}
                onChange={(e) => setKota(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Kode Pos"
                name="kodePos"
                value={kodePos || ""}
                onChange={(e) => setKodePos(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Nomor Telepon"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <InputRadio
                name="payment_method"
                value={payment || ""}
                onChange={(e) => setPayment(e.target.value)}
              />

              <div className="mt-5 flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-2/3 p-3 bg-green-700 text-white font-semibold rounded-lg cursor-pointer active:scale-95 hover:bg-green-800"
                >
                  Bayar Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-gray-100 shadow-lg p-4 md:p-5 w-full md:w-1/3">
          <h1 className="font-bold text-xl md:text-3xl mb-5">
            Ringkasan Pesanan
          </h1>
          <div className="mb-9 border-b border-gray-300">
            {cart.cartItems.map((item) => (
              <div key={item.id_produk} className="p-4">
                <div className="flex justify-between font-semibold text-sm md:text-base">
                  <p>{item.nama_produk}</p>
                  <p>
                    {item.harga_produk.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mr-4 font-semibold text-sm md:text-base">
            <p>
              {cart.cartTotalPrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
