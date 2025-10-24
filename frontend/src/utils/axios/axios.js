//axios config

import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development" ? import.meta.env.VITE_SERVER_URI : "",
  withCredentials: true, //cookie
});

export default axiosInstance;

//TODO: 오 이거 좋구만!
//FIXME: 오호라.. 
