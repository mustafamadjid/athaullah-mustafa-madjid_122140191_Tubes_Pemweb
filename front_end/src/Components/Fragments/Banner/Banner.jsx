import { Link } from "react-router";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import Button from "../../Elements/Button/Button";

import { MoveRight } from "lucide-react";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const products = [
    {
      id: 1,
      title: "Aksesoris terbaik pilihan konsumen Indonesia",
      subTitle: "Temukan kebutuhanmu sekarang",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    },
    {
      id: 2,
      title: "Beli kebutuhan ga pake ribet !!",
      subTitle: "Temukan kebutuhanmu sekarang",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    },
    {
      id: 3,
      title: "Lengkap, Murah dan Berkualitas",
      subTitle: "Temukan kebutuhanmu sekarang",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    },
    {
      id: 4,
      title: "E-comerce terbaik se Indonesia",
      subTitle: "Temukan kebutuhanmu sekarang",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    },
  ];

  return (
    <div className="lg:container max-lg:w-full">
      <div className="slider-container">
        <Slider {...settings}>
          {products?.map((product) => (
            <div key={product?.id} className="banner-slide-item">
              <div className="banner-text">
                <p className="text-sm font-inter text-[#272343] uppercase font-normal">
                  {product?.subTitle}
                </p>
                <h3 className="text-6xl text-[#272343] font-inter capitalize leading-16 max-w-[700px] w-ful font-bold mb-5 max-lg:text-xl max-lg:leading-7">
                  {product?.title}
                </h3>
                <Link to="/produk">
                  <Button variant=" bg-green-800 hover:bg-green-700 hover:gap-5 hover:duration-400 hover:ease-in-out hover:transition-all max-lg: max-lg:text-xs  max-lg:h-11 max-lg:w-3/4 ">
                    Belanja Sekarang <MoveRight />
                  </Button>
                </Link>
              </div>
              <div className="banner-image-2  bg-[#f0f2f3] w-full h-full flex items-center justify-end">
                <img
                  className="h-100 mix-blend-multiply max-lg:w-3/4 max-lg:h-3/4"
                  src={product?.image}
                  alt={product?.title}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Banner;
