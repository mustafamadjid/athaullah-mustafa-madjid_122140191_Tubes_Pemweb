import { Link } from "react-router";

const Footer = () => {
  return (
    <>
      <footer className="bg-green-800 h-[400px] flex justify-around items-center w-full rounded-t-md max-lg:flex-col">
        <div className="bg-white h-[200px] w-[300px] flex items-center justify-center rounded-2xl max-lg:h-[70px] max-lg:w-[120px] max-lg:mb-5 max-lg:mt-5">
          <h1 className="font-extrabold text-5xl text-green-700 max-lg:text-[20px]">
            Toko<span className="text-green-800">Ijo</span>
          </h1>
        </div>
        <div className="flex gap-10 max-lg:gap-5 ">
          <div>
            <h1 className="font-bold text-2xl text-white max-lg:text-lg">
              Akses
            </h1>
            <Link to={"/"}>
              <p className="mt-3 hover:underline text-white max-lg:text-xs">
                Beranda
              </p>
            </Link>
            <Link to={"/produk"}>
              <p className="mt-2 hover:underline text-white max-lg:text-xs ">
                Produk
              </p>
            </Link>
          </div>
          <div className="flex flex-col gap-4 max-lg:gap-3 max-lg:text-xs">
            <h1 className="font-bold text-2xl text-white max-lg:text-lg">
              Mitra Kami
            </h1>
            <a
              href="https://www.mi.co.id/id"
              className="hover:underline cursor-pointer text-white"
            >
              Xiaomi Indonesia
            </a>
            <a
              href="https://www.samsung.com/id/"
              className="hover:underline cursor-pointer text-white"
            >
              Samsung Indonesia
            </a>
            <a
              href="https://www.apple.com/id/"
              className="hover:underline cursor-pointer text-white"
            >
              Apple Indonesia
            </a>
            <a
              href="https://www.asus.com/id/"
              className="hover:underline cursor-pointer text-white"
            >
              Asus Indonesia
            </a>
            <a
              href="https://www.lenovo.com/id/"
              className="hover:underline cursor-pointer text-white"
            >
              Lenovo Indonesia
            </a>
          </div>

          <div>
            <h1 className="font-bold text-2xl text-white max-lg:text-lg">
              Tentang Kami
            </h1>
            <p className="mt-3 hover:underline cursor-pointer text-white max-lg:text-xs">
              Toko Ijo
            </p>
          </div>

          <div>
            <h1 className="font-bold text-2xl text-white max-lg:text-lg">
              Hubungi Kami
            </h1>
            <p className="mt-3 hover:underline cursor-pointer text-white max-lg:text-xs">
              +62-821-7567-3461
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
