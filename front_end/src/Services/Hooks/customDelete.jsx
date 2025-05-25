// Import React
import { useState } from "react";

// Import Axios
import axios from "axios";

const useDelete = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // POST dijalankan hanya saat fungsi ini dipanggil
  const deleteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(url);
      setResponse(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, deleteData };
};

export default useDelete;
