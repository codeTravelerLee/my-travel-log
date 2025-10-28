export const useUserStore = create((set) => ({
  authUser: null, //현재 로그인한 유저 정보
  loading: false,
  error: "",    
  cartItems: [], //현재 유저의 장바구니 상품들

  //setters
  setAuthUser: (user) => set({ authUser: user }),
  setCartItems: (items) => set({ cartItems: items }),

  //현재 로그인한 유저 정보 불러오기
  fetchAuthUser: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/api/auth/getCurrentUser");
    } catch (error) {
      console.error(error);
      set({error: error.response.data.error});
    } finally {
      set({loading: false})
    }
}}));
