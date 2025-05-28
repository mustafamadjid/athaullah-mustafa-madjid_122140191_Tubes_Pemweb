// Import React
import { useState, useEffect } from "react";

// Import Components
import Navbar from "../../Components/Fragments/Navbar/Navbar";
import Sidebar from "../../Components/Fragments/Sidebar/Sidebar";

// Import navigate
import { useNavigate, useParams } from "react-router";

// Import Custom Hooks
import usePost from "../../Services/Hooks/customPost";
import usePut from "../../Services/Hooks/customPut";
import useFetch from "../../Services/Hooks/customFetch";
import useDelete from "../../Services/Hooks/customDelete";

// Import List Kategori
import kategoriList from "../../Services/KategoriProduk/kategori";


// Import Toast
import { toast } from "react-toastify";

const DashboardEditProduk = () => {
  // Navigate
  const navigate = useNavigate();

  //   Params
  const { id_produk } = useParams();

  // endpoint produk
  const produkUrl = `${import.meta.env.VITE_API_URL}/produk/${id_produk}`;

  // Url  foto produk
  const urlFotoProduk = `${
    import.meta.env.VITE_API_URL
  }/produk/${id_produk}/foto`;

  //   Inisialisasi state untuk field
  const [uidPenjual, setUidPenjual] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [kategoriProduk, setKategoriProduk] = useState("");
  const [deskripsiProduk, setDeskripsiProduk] = useState("");
  const [merkProduk, setMerkProduk] = useState("");
  const [hargaProduk, setHargaProduk] = useState("");
  const [stokProduk, setStokProduk] = useState(0);
  const [gambarProduk, setGambarProduk] = useState(null);

  //   Inisialisasi state untuk preview gambar
  const [previewGambar, setPreviewGambar] = useState(urlFotoProduk);

  // State validasi foto harus diupload
  const [fotoUrl, setFotoUrl] = useState("");
  const [shouldUploadFoto, setShouldUploadFoto] = useState(false);

  //   Put Hook
  const produkUpdate = usePut(produkUrl);

  //   Post Hook
  const fotoUpdate = usePost(fotoUrl);

  //   Fetch Hook
  const produkFetch = useFetch(produkUrl);

  //   Delete Hook
  const produkDelete = useDelete(produkUrl);

  
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

  // Set Data Produk
  useEffect(() => {
    if (produkFetch.response?.status === 200) {
      setUidPenjual(produkFetch.response.data.uid_penjual || "");
      setNamaProduk(produkFetch.response.data.nama_produk || "");
      setKategoriProduk(produkFetch.response.data.kategori_produk || "");
      setDeskripsiProduk(produkFetch.response.data.deskripsi_produk || "");
      setMerkProduk(produkFetch.response.data.merk_produk || "");
      setHargaProduk(produkFetch.response.data.harga_produk || "");
      setStokProduk(produkFetch.response.data.stok_produk || "");
    }
  }, [produkFetch.response]);

  // Submit produk
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      uid_penjual: uidPenjual,
      nama_produk: namaProduk,
      kategori_produk: kategoriProduk,
      deskripsi_produk: deskripsiProduk,
      merk_produk: merkProduk,
      harga_produk: Number(hargaProduk) || 0,
      stok_produk: Number(stokProduk) || 0,
    };

    produkUpdate.putData(data);
  };

  // Validasi produk telah tersimpan lebih dahulu
  useEffect(() => {
    if (produkUpdate.response && produkUpdate.response.status === 200) {
      toast.success("Produk berhasil diupdate!", {
        position: "top-right",
        autoClose: 2000,
      });

      const res = produkUpdate.response;
      const id_produk = res?.data?.id_produk || res?.data?.data?.id_produk;

      if (id_produk && gambarProduk) {
        setShouldUploadFoto(true);
        setFotoUrl(
          `${import.meta.env.VITE_API_URL}/produk/foto/modify/${id_produk}`
        );
      }

      navigate("/dashboard/lihatproduk");
    } else if (produkUpdate.response) {
      toast.error(
        produkUpdate.response.data?.message || "Produk gagal ditambahkan!",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  }, [produkUpdate.response, gambarProduk, fotoUrl]);

  // Memulai upload foto
  useEffect(() => {
    if (shouldUploadFoto && gambarProduk) {
      const formData = new FormData();
      formData.append("foto_produk", gambarProduk);

      fotoUpdate.postData(formData);

      setShouldUploadFoto(false);
    }
  }, [shouldUploadFoto, fotoUrl, gambarProduk, fotoUpdate.postData]);

  // Notifikasi upload foto
  useEffect(() => {
    if (fotoUpdate.response) {
      if (fotoUpdate.response.status === 200) {
        toast.success(
          fotoUpdate.response.data?.message || "Foto Produk berhasil diupdate!",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );

        navigate("/dashboard/lihatproduk");
      } else {
        toast.error(fotoUpdate.response.data?.message, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  }, [fotoUpdate.response]);

  //   Handle Delete Produk
  const handleDelete = () => {
    if (window.confirm("Apakah anda yakin ingin menghapus produk ini?")) {
      produkDelete.deleteData();
    }
  };

  // Response Delete Data
  useEffect(() => {
    if (produkDelete.response) {
      if (produkDelete.response.status === 200) {
        toast.success(
          produkDelete.response.data?.message || "Produk berhasil dihapus!",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );

        navigate("/dashboard/lihatproduk");
      } else {
        toast.error(produkDelete.response.data?.message, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  });

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
              Edit Produk Anda
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

            {/* Update Button */}
            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-green-800 hover:bg-green-900 text-white font-semibold rounded-xl shadow transition duration-150"
              disabled={fotoUpdate.loading}
            >
              {fotoUpdate.loading ? "Menyimpan..." : "Perbarui"}
            </button>

            {/* Delete Button */}
            <button
              type="button"
              className="mt-5 cursor-pointer w-full py-3 bg-red-800 hover:bg-red-900 text-white font-semibold rounded-xl shadow transition duration-150"
              onClick={handleDelete}
            >
              Hapus Produk
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DashboardEditProduk;
