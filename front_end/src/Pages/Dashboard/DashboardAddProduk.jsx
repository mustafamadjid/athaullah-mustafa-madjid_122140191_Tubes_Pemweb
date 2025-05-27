// Import React
import { useState,useEffect } from "react";

// Import Components
import Navbar from "../../Components/Fragments/Navbar/Navbar";
import Sidebar from "../../Components/Fragments/Sidebar/Sidebar";

// Import Auth
import { UserAuth } from "../../Services/Auth/AuthContext";

// Import Custom Hooks
import usePost from "../../Services/Hooks/customPost";
import { toast } from "react-toastify";
import Footer from "../../Components/Fragments/Footer/FooterFragment";

const DashboardTambahProduk = () => {
  // Current User
  const { user } = UserAuth();

  const [namaProduk, setNamaProduk] = useState("");
  const [kategoriProduk, setKategoriProduk] = useState("");
  const [deskripsiProduk, setDeskripsiProduk] = useState("");
  const [merkProduk, setMerkProduk] = useState("");
  const [hargaProduk, setHargaProduk] = useState("");
  const [stokProduk, setStokProduk] = useState(0);

  const [gambarProduk, setGambarProduk] = useState(null);
  const [previewGambar, setPreviewGambar] = useState(null);

  // endpoint produk
  const produkUrl = `${import.meta.env.VITE_API_URL}/produk`;



  // State validasi foto harus diupload
  const [fotoUrl, setFotoUrl] = useState("");
  const [shouldUploadFoto, setShouldUploadFoto] = useState(false);

  // Post Hook
  const produkPost = usePost(produkUrl);
  const fotoPost = usePost(fotoUrl);
  

  // Dummy kategori
  const kategoriList = [
    "Elektronik",
    "Fashion",
    "Makanan",
    "Kesehatan",
    "Olahraga",
    "Rumah Tangga",
    "Tanaman",
  ];

  // Format harga ---
  const formatRupiah = (angkaString) => {
    if (angkaString === "" || angkaString === null) return "";
    const number = Number(angkaString);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const parseRupiah = (stringRupiah) => {
    if (!stringRupiah) return "";
    return stringRupiah.replace(/[^0-9]/g, "");
  };

  const handleHargaChange = (e) => {
    const nilaiInput = e.target.value;
    const nilaiAngkaString = parseRupiah(nilaiInput);
    setHargaProduk(nilaiAngkaString);
  };

  // Handle Perubahan Gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setGambarProduk(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewGambar(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewGambar(null);
    }
  };

  // Submit produk
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      uid_penjual: user.uid,
      nama_produk: namaProduk,
      kategori_produk: kategoriProduk,
      deskripsi_produk: deskripsiProduk,
      merk_produk: merkProduk,
      harga_produk: Number(hargaProduk) || 0,
      stok_produk: Number(stokProduk) || 0,
    };

    
    produkPost.postData(data);
    
  };

  // Validasi produk telah tersimpan lebih dahulu
  useEffect(() => {
    if (produkPost.response && produkPost.response.status === 200) {
      toast.success("Produk berhasil ditambahkan!", {
        position: "top-right",
        autoClose: 2000,
      });

      const res = produkPost.response;
      const id_produk = res?.data?.id_produk || res?.data?.data?.id_produk;

      if (id_produk && gambarProduk) {
        setShouldUploadFoto(true);
        setFotoUrl(`${import.meta.env.VITE_API_URL}/produk/${id_produk}/foto`);
      }
    } else if (produkPost.response) {
      toast.error(
        produkPost.response.data?.message || "Produk gagal ditambahkan!",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  }, [produkPost.response, gambarProduk, fotoUrl]);

  // Memulai upload foto
  useEffect(() => {
    console.log(fotoUrl);
    if (shouldUploadFoto && gambarProduk) {
      const formData = new FormData();
      formData.append("foto_produk", gambarProduk);

      fotoPost.postData(formData);

      setShouldUploadFoto(false);
    }
  }, [shouldUploadFoto, fotoUrl ,gambarProduk, fotoPost.postData]);

  // Notifikasi upload foto
  useEffect(() => {
    console.log(fotoPost.response);
    if (
      fotoPost.response 
    ) {
      if (fotoPost.response.status === 200) {
        toast.success(
          fotoPost.response.data?.message || "Foto Produk berhasil ditambahkan!",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } else {

        toast.error(
          fotoPost.response.data?.message,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
    }
  }, [fotoPost.response]);

  return (
    <>
      <Navbar />
      <div className="flex gap-10 min-h-screen bg-green-50">
        <Sidebar addProdukVariant="font-bold" />
        <div className="flex-1 flex justify-center items-start mt-35 mb-10">
          {" "}
          <form
            className="w-[480px] bg-white rounded-2xl shadow-lg p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold mb-7 text-center text-green-900">
              Tambah Produk Baru
            </h2>

            {/* Upload Gambar Produk */}
            <div className="mb-4 flex flex-col items-center">
              <label className="block mb-2 font-medium text-green-900">
                Gambar Produk
              </label>
              {previewGambar ? (
                <img
                  src={previewGambar}
                  alt="Preview Gambar"
                  className="w-40 h-40 object-cover rounded-xl border-2 border-green-700 mb-2"
                />
              ) : (
                <div className="w-40 h-40 bg-green-100 flex items-center justify-center rounded-xl border-2 border-green-300 mb-2 text-green-400 text-4xl">
                  <span className="material-symbols-outlined">image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-green-900 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-green-800 file:text-white
                 hover:file:bg-green-900
                 "
              />
            </div>

            {/* Nama Produk */}
            <div className="mb-4">
              <label
                htmlFor="nama_produk"
                className="block mb-1 font-medium text-green-900"
              >
                Nama Produk
              </label>
              <input
                type="text"
                id="nama_produk"
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}
                className="w-full border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                placeholder="Masukkan nama produk"
                required
              />
            </div>

            {/* Kategori Produk */}
            <div className="mb-4">
              <label
                htmlFor="kategori_produk"
                className="block mb-1 font-medium text-green-900"
              >
                Kategori
              </label>
              <select
                id="kategori_produk"
                value={kategoriProduk}
                onChange={(e) => setKategoriProduk(e.target.value)}
                className="w-full border border-green-700 rounded-lg px-3 py-2 bg-white focus:outline-green-800 focus:border-green-800"
                required
              >
                <option value="">Pilih Kategori</option>
                {kategoriList.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Deskripsi Produk */}
            <div className="mb-4">
              <label
                htmlFor="deskripsi_produk"
                className="block mb-1 font-medium text-green-900"
              >
                Deskripsi Produk
              </label>
              <textarea
                id="deskripsi_produk"
                value={deskripsiProduk}
                onChange={(e) => setDeskripsiProduk(e.target.value)}
                className="w-full border border-green-700 rounded-lg px-3 py-2 min-h-[80px] resize-y focus:outline-green-800 focus:border-green-800"
                placeholder="Tulis deskripsi singkat produk"
                required
              />
            </div>

            {/* Merk Produk */}
            <div className="mb-4">
              <label
                htmlFor="merk_produk"
                className="block mb-1 font-medium text-green-900"
              >
                Merk Produk
              </label>
              <input
                type="text"
                id="merk_produk"
                value={merkProduk}
                onChange={(e) => setMerkProduk(e.target.value)}
                className="w-full border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                placeholder="Contoh: Samsung, Nike, dsb."
                required
              />
            </div>

            {/* Harga Produk */}
            <div className="mb-4">
              <label
                htmlFor="harga_produk"
                className="block mb-1 font-medium text-green-900"
              >
                Harga Produk
              </label>
              <input
                type="text" // Ubah ke type="text"
                id="harga_produk"
                value={formatRupiah(hargaProduk)}
                onChange={handleHargaChange}
                className="w-full border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                placeholder="Rp 0"
                required
              />
            </div>

            {/* Stok Produk */}
            <div className="mb-6">
              <label
                htmlFor="stok_produk"
                className="block mb-1 font-medium text-green-900"
              >
                Stok Produk
              </label>
              <input
                type="number"
                id="stok_produk"
                min="0"
                value={stokProduk}
                onChange={(e) =>
                  setStokProduk(
                    Number(e.target.value) < 0 ? 0 : Number(e.target.value)
                  )
                }
                className="w-full border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                placeholder="Jumlah stok"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-green-800 hover:bg-green-900 text-white font-semibold rounded-xl shadow transition duration-150"
              disabled={fotoPost.loading}
            >
              {fotoPost.loading ? "Menyimpan..." : "Tambah Produk"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DashboardTambahProduk;
