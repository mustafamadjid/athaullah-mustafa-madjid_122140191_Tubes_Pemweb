import PropTypes from "prop-types";

import { ShoppingCart } from "lucide-react";
import { Star } from "lucide-react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CardComplete = ({ produk,idProduk, onAddToCart }) => {

  // Url foto produk
  const urlFotoProduk = `${
    import.meta.env.VITE_API_URL
  }/produk/${idProduk}/foto`;

 
  return (
    <>
      <div
        className={` lg:max-w-[350px] max-h-full flex flex-col gap-5 p-4 border-4 rounded-t-lg border-green-200  hover:bg-green-100 `}
      >
        <div className=" rounded-lg overflow-hidden shadow-lg inset-shadow-xs w-full">
          <div className="slider-container">
            <div className="bg-[#f6f6f6] p-4 max-h-100 ">
              {" "}
              <img
                className="max-w-[250px] max-h-[250px] mx-auto object-cover"
                src={urlFotoProduk}
                alt={produk.nama_produk}
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-7">
            <div
              className={`font-semibold text-[18px] text-[#272343] `}
            >
              {produk.nama_produk}
            </div>
            <div className="text-[#9a9caa] text-justify w-full">
              {produk.deskripsi_produk}
            </div>

            <div className="flex gap-10">
              <div className="font-extrabold">
                {produk?.harga_produk.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </div>
              <div className="ml flex items-center gap-2">
                <p className="text-green-700 font-bold">{produk?.merk_produk}</p>
              </div>
            </div>
          </div>
          <div className="shop carte">
            <div className="bg-green-600 p-2 rounded-md cursor-pointer hover:bg-green-500">
              <ShoppingCart
                className="text-white"
                onClick={() => onAddToCart(produk)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  //
};
CardComplete.propTypes = {
  produk: PropTypes.object,
  onAddToCart: PropTypes.func,
  wrapVariant: PropTypes.string,
  titleVariant: PropTypes.string,
};

export default CardComplete;
