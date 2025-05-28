// Import React
import { useEffect, useState } from "react";

// Import Redux
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../Services/Slice/handleCart";

// Import Router
import { useNavigate } from "react-router";

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
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [tanggalPesanan, setTanggalPesanan] = useState("");
  const [payment, setPayment] = useState("");

  // Response status
  const [responseStatus, setResponseStatus] = useState();

  const uid_pembeli = user?.uid;

  // Fetching Data
  const pembeliFetch = useFetch(
    `${import.meta.env.VITE_API_URL}/pembeli/profil/${uid_pembeli}`
  );

  // Post Data
  const pesananPost = usePost(`${import.meta.env.VITE_API_URL}/pesanan`);

  useEffect(() => {
    if (pembeliFetch.response?.status === 200) {
      setUsername(pembeliFetch.response.data.username_pembeli || "");
      setName(pembeliFetch.response.data.nama_pembeli || "");
      setEmail(pembeliFetch.response.data.email_pembeli || "");
      setPhone(pembeliFetch.response.data.nomor_handphone || "");
      setAlamat(pembeliFetch.response.data.alamat || "");
      setKota(pembeliFetch.response.data.kota || "");
      setKodePos(pembeliFetch.response.data.kode_pos || "");
    }
  }, [pembeliFetch.response, pembeliFetch.response?.data]);

  useEffect(() => {
    const date = new Date().toLocaleDateString();
    setTanggalPesanan(date);
  }, []);

  const handleCheckout = (e) => {
    e.preventDefault();
    // Data untuk submit
    const data = {
      uid_pembeli,
      username_pembeli: username,
      nama_pembeli: name,
      email_pembeli: email,
      nomor_handphone: phone,
      alamat: alamat,
      kota: kota,
      kode_pos: kodePos,
      jumlah_pesanan: cart.cartTotalPrice,
      tanggal_pesanan: tanggalPesanan,
      status_pesanan: "Aktif",
      metode_pembayaran: payment,
    };

    pesananPost.postData(data);
  };

  // Validasi Response
  useEffect(() => {
    if (pesananPost.response?.status === 200) {
      setResponseStatus(pesananPost.response.status);
      toast.success("Pesanan Berhasil Dibuat", {
        position: "top-right",
        autoClose: 1700,
      });
      setTimeout(() => {
        navigate("/pesanan");
      }, 1500);
    }
  },[pesananPost.response]);


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
                name="username_pembeli"
                value={username}
                readOnly
              />
              <Input
                type="text"
                placeholder="Nama Lengkap"
                name="nama_pembeli"
                value={name}
                readOnly
              />
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                readOnly
              />
              <Input
                type="text"
                placeholder="Alamat Lengkap"
                name="address"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Kota"
                name="kota"
                value={kota}
                onChange={(e) => setKota(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Kode Pos"
                name="kodePos"
                value={kodePos}
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
                value={payment}
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
