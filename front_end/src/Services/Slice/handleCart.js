import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const handleCartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    cartTotalQuantity: 0,
    cartTotalPrice: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.info(
          `${action.payload.title} berhasil ditambahkan ke keranjang ${state.cartItems[itemIndex].cartQuantity}`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
        toast.success(
          `${action.payload.title} berhasil ditambahkan ke keranjang`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );

      state.cartItems = nextCartItems;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.error(
        `${action.payload.title} berhasil dihapus dari keranjang`,
        {}
      );
    },
    decreaseCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity -= 1;
        toast.success(
          `berhasil mengurangi produk dari keranjang ${state.cartItems[itemIndex].cartQuantity}`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.error("Keranjang berhasil dibersihkan", {
        position: "top-right",
        autoClose: 2000,
      });
    },

    getTotals: (state, action) => {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );

      state.cartTotalQuantity = quantity;
      state.cartTotalPrice = total;
    },
  },
});

export const { addToCart, removeFromCart, decreaseCart, clearCart, getTotals } =
  handleCartSlice.actions;

export default handleCartSlice;
