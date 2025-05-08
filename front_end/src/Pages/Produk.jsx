import { Link } from "react-router";
import useFetch from "../Services/Hooks/customFetch";
import { useState } from "react";

import CardComplete from "../Components/Fragments/CardProduct/CardComplete";
import Navbar from "../Components/Fragments/Navbar/Navbar";
import Footer from "../Components/Fragments/Footer/FooterFragment";

import { useDispatch } from "react-redux";
import { addToCart } from "../Services/Slice/handleCart";

import { List, X } from "lucide-react";

const Produk = () => {
  const [url, setUrl] = useState("https://dummyjson.com/products");
  const [open, isOpen] = useState(true);

  const categoryData = useFetch("https://dummyjson.com/products/categories");
  const productsData = useFetch(url);

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <>
      <div className="w-full h-[80px]">
        <Navbar />
      </div>

      {/* Categories Responsive */}
      <div className="mt-10 padding-nav flex gap-4 items-center h-0 lg:hidden">
        {open ? (
          <List
            className="w-10 h-10 cursor-pointer bg-green-700  rounded-md text-white p-2 active:scale-95"
            onClick={() => isOpen(!open)}
          />
        ) : (
          <X
            className="w-10 h-10 cursor-pointer bg-green-700  rounded-md text-white p-2 active:scale-95"
            onClick={() => isOpen(!open)}
          />
        )}
        <p className="font-semibold">Kategori Produk</p>
      </div>

      <div className="wrapper w-full lg:padding-product flex gap-2.5 flex-row mb-20 ">
        {/* Categories Component*/}
        <div
          className={
            open
              ? "bg-[#f8f8f8] shadow-md inset-shadow-xs p-10 flex flex-col gap-7 rounded-md max-lg:hidden"
              : "bg-[#f8f8f8] shadow-md inset-shadow-xs p-10 flex flex-col gap-7 rounded-md max-lg:absolute max-lg:z-100 max-lg:h-4/4"
          }
        >
          <h1
            className="text-[15px] font-extrabold hover:text-green-700 cursor-pointer"
            onClick={() => setUrl("https://dummyjson.com/products")}
          >
            All Categories
          </h1>
          <div className="flex flex-col gap-6 max-lg:overflow-scroll max-lg:gap-10">
            {categoryData.data?.map((category) => (
              <h1
                className="text-[16px] font-semibold hover:text-green-700 cursor-pointer "
                onClick={() =>
                  setUrl(
                    `https://dummyjson.com/products/category/${category.slug}`
                  )
                }
              >
                {category.name}
              </h1>
            ))}
          </div>
        </div>

        {/* Product Component*/}
        <div className="max-h-screen padding-nav flex flex-col items-center gap-5 basis-3/4 overflow-auto  max-lg:basis-full">
          <div className="flex flex-row flex-wrap justify-center gap-14 items-center max-lg:w-full max-lg:flex-wrap ">
            {productsData.data?.products.map((product) => (
              <CardComplete
                key={product.id}
                product={product}
                wrapVariant={"max-w-xs"}
                titleVariant={"w-3/4"}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Produk;
