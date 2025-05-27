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
import DashboardProfil from "./Pages/Dashboard/DashboardProfil";
import DashboardTambahProduk from "./Pages/Dashboard/DashboardAddProduk";
import DashboardLihatProduk from "./Pages/Dashboard/DashboardSeeProduk";

// Protected Route
import ProtectedRouteLogin from "./Services/ProtectedRoute/ProtectedRouteLogin";
import ProtectedRoutePenjual from "./Services/ProtectedRoute/ProtectedRoutePenjual";
import ProtectedRouteLoggedIn from "./Services/ProtectedRoute/ProtectedRouteLoggedIn";
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
    element: (
      <ProtectedRouteLogin>
        <Cart />
      </ProtectedRouteLogin>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRouteLogin>
        <CheckoutPage />
      </ProtectedRouteLogin>
    ),
  },
  {
    path: "/pesanan",
    element: (
      <ProtectedRouteLogin>
        <PesananPage />
      </ProtectedRouteLogin>
    ),
  },
  {
    path: "/akun",
    element: (
      <ProtectedRouteLogin>
        <Akun />
      </ProtectedRouteLogin>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRouteLoggedIn>
        <RegisterPage />
      </ProtectedRouteLoggedIn>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard/profil",
    element: (
      <ProtectedRoutePenjual>
        <DashboardProfil />
      </ProtectedRoutePenjual>
    ),
  },
  {
    path: "/dashboard/tambahproduk",
    element: (
      <ProtectedRoutePenjual>
        <DashboardTambahProduk />
      </ProtectedRoutePenjual>
    ),
  },
  {
    path: "/dashboard/lihatproduk",
    element: (
      <ProtectedRoutePenjual>
        <DashboardLihatProduk />
      </ProtectedRoutePenjual>
    ),
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
