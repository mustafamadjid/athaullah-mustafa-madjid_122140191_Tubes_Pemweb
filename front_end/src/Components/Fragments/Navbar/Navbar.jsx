// Import React
import { useEffect, useState } from "react";

// Import Link router
import { Link } from "react-router";

// Lucide Icon
import {
  ShoppingCart,
  House,
  ShoppingBasket,
  Menu,
  X,
  Package,
  UserRound,
} from "lucide-react";

// Import Toast
import { toast } from "react-toastify"; 

// Import Auth
import { UserAuth } from "../../../Services/Auth/AuthContext";

const NavbarMenu = [
  {
    id: 1,
    title: "Beranda",
    path: "/",
    icon: <House />,
  },
  {
    id: 2,
    title: "Produk",
    path: "/produk",
    icon: <ShoppingBasket />,
  },
  {
    id: 3,
    title: "Pesanan Anda",
    path: "/Pesanan",
    icon: <Package />,
  },
  {
    id: 4,
    title: "Keranjang",
    path: "/cart",
    icon: <ShoppingCart size={"1.5rem"} />,
  },
];

const Navbar = () => {
  // User Auth Context
  const { user, logOut } = UserAuth();

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await logOut();
      toast.success("Anda Telah Berhasil Logout", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`flex justify-between items-center w-full padding-nav fixed top-0 z-200 ${
          scroll ? "bg-white shadow-md" : ""
        }`}
      >
        <div>
          <h1 className="font-extrabold text-4xl">
            Toko<span className="text-green-800">Ijo</span>
          </h1>
        </div>
        {/* Hamburger Icon */}
        <div className="lg:hidden cursor-pointer ">
          {open ? (
            <Menu
              className="w-8 h-8 hover:text-green-800 active:scale-90 "
              onClick={() => setOpen(!open)}
            />
          ) : (
            <X
              className="w-8 h-8 hover:text-green-800 active:scale-90 "
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        <div className="max-lg:hidden">
          <ul className="flex gap-11 ml-15 ">
            {NavbarMenu.map((menu) => {
              return (
                <li key={menu.id}>
                  <Link to={menu.path} className="hover:text-green-800">
                    <div className="text-xl flex gap-2 ">
                      {menu.icon}
                      {menu.title}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="max-lg:hidden flex items-center gap-5">
          {/* Statement to check if user logged in */}
          {user?.uid ? (
            <>
              <button
                onClick={handleSignOut}
                className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold"
              >
                Logout
              </button>

              <div className="flex gap-3 items-center">
                <Link
                  className="flex gap-2 items-center hover:text-green-800 text-xl"
                  to={"/akun"}
                >
                  <UserRound size={"1.5rem"} />
                  Akun
                </Link>
              </div>
            </>
          ) : (
            <div className="px-6 py-2 rounded-md bg-green-800 hover:bg-green-700 cursor-pointer">
              <Link to="/login" className="text-white font-semibold">
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hamburger Menu */}

      <div
        className={` ${
          open
            ? "hidden"
            : "h-3/4 bg-white shadow-lg inset-shadow-sm  fixed top-22 w-full  p-5 flex flex-col items-center justify-center gap-13 z-10 rounded-b-[45px] lg:hidden "
        }`}
      >
        <div className="mr-4">
          <ul className="flex gap-13 flex-col">
            {NavbarMenu.map((menu) => {
              return (
                <li key={menu.id}>
                  <Link to={menu.path} className="hover:text-green-800">
                    <div className="text-xl flex gap-3 ">
                      {menu.icon}
                      {menu.title}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="">
          {/* Statement to check if user logged in */}
          {user?.uid ? (
            <>
              <button
                onClick={handleSignOut}
                className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold"
              >
                Logout
              </button>

              <div className="flex gap-3 items-center">
                <Link
                  className="flex gap-2 items-center hover:text-green-800 text-xl"
                  to={"/akun"}
                >
                  <UserRound size={"1.5rem"} />
                  Akun
                </Link>
              </div>
            </>
          ) : (
            <div className="px-6 py-2 rounded-md bg-green-800 hover:bg-green-700 cursor-pointer">
              <Link to="/login" className="text-white font-semibold">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
