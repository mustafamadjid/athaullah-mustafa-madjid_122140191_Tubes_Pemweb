import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await axios.get(url, { signal });
        if (response.status !== 200)
          throw new Error(
            `Jaringan tidak dalam keaadan baik :  ${response.statusText}`
          );
        setData(response.data);
      } catch (error) {
        setError(error.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, error, loading };
};

export default useFetch;
