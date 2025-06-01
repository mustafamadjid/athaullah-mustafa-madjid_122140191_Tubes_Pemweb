// Import Router
import { Link } from "react-router";

const CardPenjual = ({
  idProduk,
  namaProduk,
  merkProduk,
  hargaProduk,
  deskripsiProduk,
  stokProduk,
}) => {
  // Url foto produk
  const urlFotoProduk = `${
    import.meta.env.VITE_API_URL
  }/produk/${idProduk}/foto`;

  return (
    <>
      {/* Grid produk */}
      <div
        key={idProduk}
        className="min-w-[300px] max-w-xs max-h-1/2 bg-white rounded-3xl shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col border border-[#e9eadf] relative group"
      >
        {/* Decorative accent */}
        <span className="absolute top-4 right-4 opacity-10 text-5xl rotate-12 pointer-events-none select-none"></span>
        {/* Image */}
        <img
          src={urlFotoProduk}
          alt={namaProduk}
          className="w-full h-52 object-cover object-center rounded-t-3xl border-b-4 border-[#205044] group-hover:scale-105 transition-transform duration-500"
        />
        {/* Konten */}
        <div className="flex-1 flex flex-col px-5 pt-5 pb-4 relative">
          <h2 className="text-2xl font-semibold text-[#205044] mb-1">
            {namaProduk}
          </h2>
          {/* Merk Produk */}
          <h3 className="text-md font-medium  mb-1">Merk: {merkProduk}</h3>
          {/* Harga Produk */}
          <p className="text-lg mt-8 font-semibold text-[#205044] mb-3">
            Harga: Rp{hargaProduk?.toLocaleString("id-ID")}
          </p>
          {/* Deskripsi */}
          <h3 className="text-sm mt-4 text-[#6c8c56] mb-2">
            {deskripsiProduk}
          </h3>
      
          {/* Stok & tombol */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-[#205044]">{stokProduk}</span>
              <span className="text-[#6c8c56]">stok</span>
            </div>
            {/* Edit Button */}
            <Link to={`/dashboard/editproduk/${idProduk}`}>
            <button className="cursor-pointer bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded">
              Edit Produk
            </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPenjual;
