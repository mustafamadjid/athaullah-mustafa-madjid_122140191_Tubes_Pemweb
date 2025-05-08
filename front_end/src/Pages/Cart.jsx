import Navbar from "../Components/Fragments/Navbar/Navbar";
import Button from "../Components/Elements/Button/Button";
import CartTable from "../Components/Layout/cartTable";
import Footer from "../Components/Fragments/Footer/FooterFragment";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  addToCart,
  removeFromCart,
  decreaseCart,
  clearCart,
  getTotals,
} from "../Services/Slice/handleCart";

import { Link } from "react-router";

import { Frown } from "lucide-react";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };
  const handleClearCart = () => {
    if (window.confirm("Apakah anda yakin ingin membersihkan keranjang?")) {
      dispatch(clearCart());
    }
  };

  useEffect(() => {
    dispatch(getTotals());
  }, [cart]);

  return (
    <>
      <div className="w-full h-[80px] mb-20">
        <Navbar />
      </div>
      <div className="padding-product">
        {cart.cartItems.length > 0 && (
          <>
            <h1 className="font-bold text-4xl mt-10 text-center mb-10">
              Keranjang Anda
            </h1>
            <div className="flex justify-between items-center">
              <button
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-10 cursor-pointer rounded-md active:scale-95"
                onClick={handleClearCart}
              >
                Bersihkan Keranjang
              </button>
            </div>
          </>
        )}
      </div>
      <div>
        {cart.cartItems.length === 0 ? (
          <>
            <div className="padding-product flex flex-col justify-center items-center gap-10 h-[400px]">
              <h1 className="font-bold text-7xl  text-center animate-bounce">
                Keranjang Kosong
              </h1>
              <Frown size="5rem" className="animate-bounce" />
              <Link to={"/produk"}>
                <Button variant={"bg-green-700 hover:bg-green-800 p-5 text-md"}>
                  Belanja Sekarang
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <CartTable
            cartItems={cart.cartItems}
            handleAddToCart={handleAddToCart}
            handleRemoveFromCart={handleRemoveFromCart}
            handleDecreaseCart={handleDecreaseCart}
            handleClearCart={handleClearCart}
          />
        )}
      </div>

      {/* Total Harga */}
      {cart.cartItems.length > 0 && (
        <div className="flex items-center flex-col mr-10 mt-5  h-[300px] absolute right-0 max-lg:justify-center max-lg:mr-5">
          <div className="p-5 border-b border-slate-400">
            <h1 className="font-extrabold text-2xl">
              Total Harga :{" "}
              {cart.cartTotalPrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </h1>
          </div>

          <div>
            <Link to={"/checkout"}>
              <button className="bg-green-700 mt-8 hover:bg-green-800 text-white font-bold py-4 px-10 cursor-pointer rounded-md active:scale-95">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-100">
        <Footer />
      </div>
    </>
  );
};

export default Cart;
