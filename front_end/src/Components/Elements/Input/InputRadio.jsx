const InputRadio = ({ name, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="payment_method">Metode Pembayaran:</label>
      <select
        id="payment_method"
        name={name}
        className="border border-gray-300 rounded-md p-2"
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="" disabled>
          -- Pilih Metode --
        </option>
        <option value="Cash (Tunai)">Bayar Tunai (Cash)</option>
        <option value="PayPal">PayPal</option>
        <option value="Kartu Kredit">Kartu Kredit/Debit</option>
        <option value="QRIS">QRIS</option>
      </select>
    </div>
  );
};

export default InputRadio;
