// Import React
import { useState, useEffect } from "react";

// Import Components
import CardProduct from "../Fragments/CardProduct/CardProduct";

// Import Slider
import Slider from "react-slick";

// Import Hooks
import useFetch from "../../Services/Hooks/customFetch";

// Import Redux
import { useDispatch } from "react-redux";
import { addToCart } from "../../Services/Slice/handleCart";

const FeaturedProducts = () => {
  const { response } = useFetch(`${import.meta.env.VITE_API_URL}/produk`);

  const [data,setData] = useState([]);

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 1000,
    cssEase: "linear",
  };

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Set Data
  useEffect(() => {
    setData(response?.data);
  }, [response?.data]);

  return (
    <>
      <div>
        <h1 className="font-bold text-3xl mt-10 max-lg:text-2xl">
          Produk Pilihan{" "}
        </h1>
      </div>
      <div className="slider-container">
        <Slider {...settings} className="">
          {/* <div className="flex  justify-center items-center gap-4"> */}
          {data?.map((product) => (
            <CardProduct
              key={product.id_produk}
              idProduk={product.id_produk}
              product={product}
              wrapVariant={"max-w-sm"}
              titleVariant={"w-full"}
              onAddToCart={handleAddToCart}
            />
          ))}
          {/* </div> */}
        </Slider>
      </div>
    </>
  );
};

export default FeaturedProducts;
