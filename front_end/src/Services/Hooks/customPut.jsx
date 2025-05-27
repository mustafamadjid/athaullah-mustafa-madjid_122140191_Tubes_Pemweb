// Import React
import { useState } from "react";

// Import Axios
import axios from "axios";

const usePut = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // POST dijalankan hanya saat fungsi ini dipanggil
  const putData = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(url, data);
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, putData};
};

export default usePut;
