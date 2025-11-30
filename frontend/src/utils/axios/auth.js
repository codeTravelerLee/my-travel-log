import axiosInstance from "./axios.js";

//비밀번호 재설정을 위한 사용자 검증, 재설정 링크를 담은 이메일 전송 요청
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/api/auth/forgotPassword", {
      email,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//사용자가 이메일에서 링크로 받은 페이지에서 변경한 값을 실제 DB에 반영하는 API호출
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await axiosInstance.patch("/api/auth//resetPassword", {
      resetToken,
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
