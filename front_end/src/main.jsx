import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// React Router
import { createBrowserRouter, RouterProvider } from "react-router";

// Redux
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import "./index.css";

// React Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Beranda from "./Pages/Beranda";
import Produk from "./Pages/Produk";
import Cart from "./Pages/Cart";
import CheckoutPage from "./Pages/Checkout";
import PesananPage from "./Pages/Pesanan";
import Akun from "./Pages/Akun";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/Register";

// Services
import handleCartSlice from "./Services/Slice/handleCart";
import { getTotals } from "./Services/Slice/handleCart";

// Context API Authentication
import { AuthContextProvider } from "./Services/Auth/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/produk",
    element: <Produk />,
  },

  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/pesanan",
    element: <PesananPage />,
  },
  {
    path: "/akun",
    element: <Akun />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const store = configureStore({
  reducer: {
    cart: handleCartSlice.reducer,
  },
});

store.dispatch(getTotals());

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <StrictMode>
      <Provider store={store}>
        <ToastContainer />
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>
  </AuthContextProvider>
);
