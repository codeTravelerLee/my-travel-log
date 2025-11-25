//axios config

import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_SERVER_URI : "";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, //cookie
});

// 액세스 토큰 갱신: refresh 요청은 동일한 인스턴스로 재귀 호출되지 않도록
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 이미 재시도한 요청이거나 refresh 자체에 대해선 재시도 금지
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !(originalRequest?.url || "").includes("/api/auth/refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        // refresh 요청은 동일한 axiosInstance가 아닌 기본 axios로 보냄
        // (인터셉터 재귀를 방지)
        await axios.post(
          `${baseURL}/api/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
