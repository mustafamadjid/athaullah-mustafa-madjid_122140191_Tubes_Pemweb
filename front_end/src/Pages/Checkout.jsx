import Navbar from "../Components/Fragments/Navbar/Navbar";
import Input from "../Components/Elements/Input/Input";
import InputRadio from "../Components/Elements/Input/InputRadio";

import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";

import { clearCart } from "../Services/Slice/handleCart";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart);

  const [payment, setPayment] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handlePaymentChange = (value) => {
    setPayment(value);
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const paidCart = {
      firstName: formData.get("namaAwal"),
      lastName: formData.get("namaAkhir"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("Kota"),
      postalCode: formData.get("kodePos"),
      phone: formData.get("phone"),
      paymentMethod: payment,
      items: cart.cartItems.map((item) => ({
        title: item.title,
        price: item.price,
        quantity: item.cartQuantity,
      })),
      totalPrice: cart.cartTotalPrice,
    };

    if (window.confirm("Apakah anda yakin ingin checkout?")) {
      localStorage.setItem("paidCart", JSON.stringify(paidCart));
      handleClearCart();
      toast.success("Checkout Berhasil", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/pesanan");
    }
  };

  return (
    <>
      <Navbar />

      {/* Checkout Component */}
      <div className="padding-nav mt-10 flex flex-col gap-10 md:flex-row">
        {/* Informasi Pembayaran */}
        <div className="w-full md:w-1/2">
          <h1 className="font-bold text-xl md:text-3xl">
            Informasi Pembayaran
          </h1>
          <div className="p-4 md:p-5 rounded-sm mt-5 bg-white shadow-md">
            <form onSubmit={handleCheckout}>
              <Input
                type="text"
                placeholder="Nama Awal"
                name="namaAwal"
                required
              />
              <Input
                type="text"
                placeholder="Nama Akhir"
                name="namaAkhir"
                required
              />
              <Input type="email" placeholder="Email" name="email" required />
              <Input type="text" placeholder="Alamat" name="address" required />
              <Input type="text" placeholder="Kota" name="Kota" required />
              <Input
                type="text"
                placeholder="Kode Pos"
                name="kodePos"
                required
              />
              <Input
                type="tel"
                placeholder="Nomor Telepon"
                name="phone"
                required
              />
              <InputRadio
                name="payment_method"
                onChange={handlePaymentChange}
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

        {/* Ringkasan Pesanan */}
        <div className="bg-gray-100 shadow-lg p-4 md:p-5 w-full md:w-1/3">
          <h1 className="font-bold text-xl md:text-3xl mb-5">
            Ringkasan Pesanan
          </h1>
          <div className="mb-9 border-b border-gray-300">
            {cart.cartItems.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex justify-between font-semibold text-sm md:text-base">
                  <p>{item.title}</p>
                  <p>
                    {item.price.toLocaleString("id-ID", {
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
