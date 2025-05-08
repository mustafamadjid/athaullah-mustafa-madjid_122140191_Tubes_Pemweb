const CartTable = ({
  cartItems,
  handleAddToCart,
  handleRemoveFromCart,
  handleDecreaseCart,
}) => {
  const qtyPrice = (qty, price) => {
    return (qty * price).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  return (
    <div className="relative flex flex-col w-full h-[800px] overflow-y-scroll overflow bg-white shadow-md rounded-lg bg-clip-border padding-nav ">
      <table className="w-full text-sm lg:text-base border-2 border-slate-100">
        <thead className="text-white">
          <tr className="bg-green-700">
            <th className="w-1/2 p-4 font-semibold text-xs lg:text-lg">
              Produk
            </th>
            <th className="p-4 font-semibold text-xs lg:text-lg">Harga</th>
            <th className="p-4 font-semibold text-xs lg:text-lg">Jumlah</th>
            <th className="p-4 font-semibold text-xs lg:text-lg">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="p-4 border-b border-slate-200 flex flex-col lg:flex-row gap-5 items-center">
                <div className="w-full lg:w-1/2">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="max-w-[100px] lg:max-w-[120px] mx-auto hover:shadow-lg hover:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-3 lg:gap-5 text-center lg:text-left">
                  <p className="text-sm lg:text-lg font-semibold">
                    {item.title}
                  </p>
                  <p className="py-1 px-3 w-fit bg-green-500 text-white rounded-lg text-xs lg:text-base">
                    {item.category}
                  </p>
                </div>
              </td>
              <td className="p-4 text-center text-xs lg:text-lg border-slate-200 border-b">
                {qtyPrice(item.cartQuantity, item.price)}
              </td>
              <td className="p-4 border-b border-slate-200">
                <div className="flex justify-center items-center gap-3 lg:gap-5">
                  <p className="text-sm lg:text-lg order-1">
                    {item.cartQuantity}
                  </p>
                  <button
                    className="p-1 bg-green-600 text-white rounded-md cursor-pointer active:scale-95 text-xs lg:text-base lg:p-2 order-2"
                    onClick={() => handleAddToCart(item)}
                  >
                    +
                  </button>
                  <button
                    className="p-1 bg-green-600 text-white rounded-md cursor-pointer active:scale-95 text-xs lg:text-base lg:p-2"
                    onClick={() => handleDecreaseCart(item)}
                  >
                    -
                  </button>
                </div>
              </td>

              <td>
                <button
                  className="p-1 bg-red-500 text-white rounded-md cursor-pointer active:scale-95 hover:bg-red-600 text-xs lg:text-base lg:p-2"
                  onClick={() => handleRemoveFromCart(item)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
