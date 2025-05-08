import { useSelector } from "react-redux";
import Navbar from "../Components/Fragments/Navbar/Navbar";

const PesananPage = () => {
  const paidCart = JSON.parse(localStorage.getItem("paidCart"));
  const cart = useSelector((state) => state.cart);

  return (
    <>
      <Navbar />

      <div className="padding-nav mt-20">
        {paidCart ? (
          <>
            {/* Header */}
            <div className="mb-10">
              <h1 className="font-bold text-3xl text-green-800">
                Pesanan Diproses
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
                  { label: "Nama", value: paidCart?.firstName },
                  { label: "Alamat", value: paidCart?.address },
                  { label: "Kota", value: paidCart?.city },
                  { label: "Kode Pos", value: paidCart?.postalCode },
                  { label: "Telepon", value: paidCart?.phone },
                  {
                    label: "Metode Pembayaran",
                    value: paidCart?.paymentMethod,
                  },
                ].map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-xl font-semibold">
                      {detail.label}:
                    </span>
                    <span className="text-xl font-normal">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Barang Pesanan */}
            <div className="p-5 bg-gray-100 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-5 text-green-800">
                Barang Pesanan
              </h1>
              <div className="space-y-4">
                {paidCart?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-300 pb-4"
                  >
                    <div>
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        Harga:{" "}
                        {item.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      Jumlah: {item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Harga */}
              <div className="mt-10 flex justify-end">
                <h1 className="text-xl font-bold text-green-800">
                  Total Harga:{" "}
                  {paidCart.totalPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </h1>
              </div>
            </div>
          </>
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
