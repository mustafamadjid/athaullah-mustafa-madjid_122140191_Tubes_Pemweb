import CardProduct from "../Fragments/CardProduct/CardProduct";

import Slider from "react-slick";

import useFetch from "../../Services/Hooks/customFetch";

import { useDispatch } from "react-redux";
import { addToCart } from "../../Services/Slice/handleCart";

const FeaturedProducts = () => {
  const { data } = useFetch("https://dummyjson.com/products");

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    cssEase: "linear",
  };

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

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
          {data?.products.map((product) => (
            <CardProduct
              key={product.id}
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
