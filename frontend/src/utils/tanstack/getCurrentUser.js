export const getCurrentUser = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URI}/api/auth/getCurrentUser`,
      {
        credentials: "include",
      }
    );

    const response = await res.json();

    if (response.error) return null;

    //prettier-ignore
    if(!res.ok || response.error) throw new Error(response.error || "알 수 없는 에러가 발생했습니다.");

    return response;
  } catch (error) {
    console.log(`error getting current user data: ${error.message}`);
    throw error;
  }
};
