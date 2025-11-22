//axios config

import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_SERVER_URI
      : "",
  withCredentials: true, //cookie
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {}
);

export default axiosInstance;
