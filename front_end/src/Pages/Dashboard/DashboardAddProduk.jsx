// Import React
import { useState,useEffect } from "react";

// Import Components
import Navbar from "../../Components/Fragments/Navbar/Navbar";
import Sidebar from "../../Components/Fragments/Sidebar/Sidebar";

// Import Router
import { Link } from "react-router";

// Import Custom Hooks
import usePost from "../../Services/Hooks/customPost";
import { toast } from "react-toastify";

const DashboardTambahProduk = () => {
  const [namaProduk, setNamaProduk] = useState("");
  const [kategoriProduk, setKategoriProduk] = useState("");
  const [deskripsiProduk, setDeskripsiProduk] = useState("");
  const [merkProduk, setMerkProduk] = useState("");
  const [hargaProduk, setHargaProduk] = useState(0);
  const [stokProduk, setStokProduk] = useState(0);

  const [gambarProduk, setGambarProduk] = useState(null);
  const [previewGambar, setPreviewGambar] = useState(null);

  // endpoint produk
  const produkUrl = `${import.meta.env.VITE_API_URL}/produk`;

  // endpoint foto dinamis
  const [fotoUrl, setFotoUrl] = useState(null);
  const [shouldUploadFoto, setShouldUploadFoto] = useState(false);

  const { response, error, loading, postData } = usePost();

  // Dummy kategori
  const kategoriList = [
    "Elektronik",
    "Fashion",
    "Makanan",
    "Kesehatan",
    "Olahraga",
    "Rumah Tangga",
  ];

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

  // Submit produk (tanpa gambar)
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      nama_produk: namaProduk,
      kategori_produk: kategoriProduk,
      deskripsi_produk: deskripsiProduk,
      merk_produk: merkProduk,
      harga_produk: hargaProduk,
      stok_produk: stokProduk,
    };

    postData(produkUrl, data);
  };

  // Upload Foto Setelah Produk Tersimpan
  useEffect(() => {
    if (response && response.status === 200) {
      toast.success("Produk berhasil ditambahkan!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Ambil id_produk dari response
      const id_produk = response.data?.id_produk || response.data?.data?.id_produk;

      if (id_produk && gambarProduk) {
        setFotoUrl(`${import.meta.env.VITE_API_URL}/produk/${id_produk}/foto`);
        setShouldUploadFoto(true);
      }
    } else if (response && response.status !== 200) {
      toast.error("Produk gagal ditambahkan!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    
  }, [response]);

  useEffect(() => {
    if (shouldUploadFoto && fotoUrl && gambarProduk) {
      const formData = new FormData();
      formData.append("gambar_produk", gambarProduk);

      // Gunakan hook yang sama
      postData(fotoUrl, formData);

      setShouldUploadFoto(false); // supaya tidak infinite loop
    }
    
  }, [shouldUploadFoto, fotoUrl, gambarProduk]);

  // Notifikasi upload foto 
  useEffect(() => {
    if (fotoUrl && response && response.status === 200) {
      toast.success("Foto Produk berhasil ditambahkan!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else if (fotoUrl && response && response.status !== 200) {
      toast.error("Foto Produk gagal ditambahkan!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    
  }, [fotoUrl, response]);

  return (
    <>
      <Navbar />
      <div className="flex gap-10 min-h-screen bg-green-50">
        <Sidebar addProdukVariant="font-bold" />
        <div className="flex-1 flex justify-center items-start mt-35">
          <form
            className="w-[480px] bg-white rounded-2xl shadow-lg p-8"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
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
                required
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
                Harga Produk (Rp)
              </label>
              <input
                type="number"
                id="harga_produk"
                value={hargaProduk}
                onChange={(e) => setHargaProduk(Number(e.target.value))}
                className="w-full border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                min="0"
                placeholder="Harga produk"
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
                value={stokProduk}
                onChange={(e) => setStokProduk(Number(e.target.value))}
                className="w-full border border-green-700 rounded-lg px-3 py-2 focus:outline-green-800 focus:border-green-800"
                min="0"
                placeholder="Jumlah stok"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-800 hover:bg-green-900 text-white font-semibold rounded-xl shadow transition duration-150"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Tambah Produk"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default DashboardTambahProduk;
