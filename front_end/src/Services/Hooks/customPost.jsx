// Import React
import { useState } from "react";

// Import Axios
import axios from "axios";

const usePost = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // POST dijalankan hanya saat fungsi ini dipanggil
  const postData = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(url, data);
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, postData };
};

export default usePost;
