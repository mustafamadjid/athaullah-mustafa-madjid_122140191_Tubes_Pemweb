import PropTypes from "prop-types";

import { ShoppingCart } from "lucide-react";
import { Star } from "lucide-react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CardComplete = ({ product, onAddToCart, wrapVariant, titleVariant }) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };

  const imageContent = () => {
    if (product?.images?.length > 1) {
      return (
        <Slider {...settings}>
          {product.images.map((image, index) => (
            <img
              key={index}
              className="w-full mx-auto object-cover"
              src={image}
              alt={product?.title}
              loading="lazy"
            />
          ))}
        </Slider>
      );
    } else {
      return (
        <img
          className="w-full mx-auto object-cover"
          src={product?.images[0]}
          alt={product?.title}
        />
      );
    }
  };
  return (
    <>
      <div
        className={` ${wrapVariant} flex flex-col gap-5 p-4 border-4 rounded-t-lg border-green-200  hover:bg-green-100`}
      >
        <div className=" rounded-lg overflow-hidden shadow-lg inset-shadow-xs w-full">
          <div className="slider-container">
            <div className="bg-[#f7f7f5] p-4 max-h-86 ">{imageContent()}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-7">
            <div
              className={`font-semibold text-[18px] text-[#272343] ${titleVariant}`}
            >
              {product?.title}
            </div>
            <div className="text-[#9a9caa] text-justify w-full">
              {product?.description}
            </div>

            <div className="flex justify-between ">
              <div className="font-extrabold">
                {product?.price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Star />
                {product?.rating}
              </div>
            </div>
          </div>
          <div className="shop cart">
            <div className="bg-green-600 p-2 rounded-md cursor-pointer hover:bg-green-500">
              <ShoppingCart
                className="text-white"
                onClick={() => onAddToCart(product)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  //

  CardProduct.propTypes = {
    product: PropTypes.object,
    onAddToCart: PropTypes.func,
    wrapVariant: PropTypes.string,
    titleVariant: PropTypes.string,
  };
};

export default CardComplete;
