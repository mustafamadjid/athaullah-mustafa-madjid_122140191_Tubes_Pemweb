import { Link } from "react-router";
import { useEffect, useState } from "react";

import {
  ShoppingCart,
  House,
  ShoppingBasket,
  Menu,
  X,
  Package,
} from "lucide-react";
import { UserRound } from "lucide-react";

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
];

const Navbar = () => {
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
          <ul className="flex gap-5 ml-15 ">
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
        <div className="max-lg:hidden">
          <div className="flex gap-3 items-center">
            <Link
              className="flex gap-2 items-center hover:text-green-800 text-lg"
              to={"/cart"}
            >
              <ShoppingCart size={"1.5rem"} />
              Keranjang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hamburger Menu */}

      <div
        className={` ${
          open
            ? "hidden"
            : "h-1/2 bg-white shadow-lg inset-shadow-sm  fixed top-22 w-full  p-5 flex flex-col items-center justify-center gap-13 z-10 rounded-b-[45px] lg:hidden "
        }`}
      >
        <div className="mr-4">
          <ul className="flex gap-13 flex-col">
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
        <div className="">
          <div className="flex gap-13 flex-col">
            <Link
              className="flex gap-2 items-center hover:text-green-800 text-xl"
              to={"/cart"}
            >
              <ShoppingCart size={"1.5rem"} />
              Keranjang
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
