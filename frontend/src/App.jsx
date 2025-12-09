import "./App.css";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import LogInPage from "./pages/auth/logIn/LogInPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import ShopManageHome from "./pages/shop/ShopManageHome";
import ProductMain from "./pages/product/ProductMain";
import AdminHome from "./pages/admin/AdminHome";
import CartHome from "./pages/cart/CartHome";
import ProductDetail from "./pages/product/ProductDetail";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancel from "./pages/payment/PaymentCancel";
import Payment from "./pages/payment/Payment";
import OrderHistoryPage from "./pages/order/OrderHistoryPage";
import ForgotPassword from "./pages/auth/logIn/ForgotPassword";
import ResetPassword from "./pages/auth/logIn/ResetPassword";

import Sidebar from "./components/commons/SideBar";
import RightPanel from "./components/commons/RightPannel";
import LoadingSpinner from "./components/commons/LoadingSpinner";

import { useUserStore } from "./store/useUserStore";
import AddProduct from "./pages/shop/AddProduct";
import EditProduct from "./pages/shop/EditProduct";

function App() {
  const { fetchAuthUser, authUser, loading } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      await fetchAuthUser();
    };
    //zustand로 현재 로그인한 유저 정보를 불러옴
    fetchUser();
  }, []);

  //rightPanel을 숨길 경로 지정
  const location = useLocation();
  const { pathname } = location;

  const hideRightPanelRoutes = [
    "/products",
    "/product",
    "/shop",
    "/shops",
    "/admin",
    "/carts",
    "/payment",
    "/order",
    "/reset",
  ];

  const shouldHideRightPanel = hideRightPanelRoutes.some((path) => {
    return pathname.includes(path);
  });

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto ">
      {authUser && <Sidebar />}
      <main className="flex-1 flex flex-col relative min-h-screen overflow-auto scrollbar-hide">
        <Routes>
          <Route
            path="/"
            element={
              !loading && authUser ? <HomePage /> : <Navigate to={"/logIn"} />
            }
          />
          <Route
            path="/signUp"
            element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/logIn"
            element={!authUser ? <LogInPage /> : <Navigate to={"/"} />}
          />
          {/* 비밀번호 재설정에 사용할 이메일을 입력하기 위한 페이지 */}
          <Route
            path="/forgot-password"
            element={!authUser ? <ForgotPassword /> : <Navigate to={"/"} />}
          />
          {/* 이메일로 전달된 링크를 통해 접속 가능한 실제 비밀번호 재설정 페이지 */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile/:userName"
            element={authUser ? <ProfilePage /> : <Navigate to={"/logIn"} />}
          />
          <Route
            path="/notifications"
            element={
              authUser ? <NotificationPage /> : <Navigate to={"/logIn"} />
            }
          />
          <Route
            path="/products"
            element={authUser ? <ProductMain /> : <Navigate to={"/logIn"} />}
          />
          <Route
            path="/product/:id"
            element={authUser ? <ProductDetail /> : <Navigate to={"/logIn"} />}
          />
          {/* 가게 관리 페이지 */}
          <Route
            path="/shop/:id"
            element={
              authUser && authUser.role === "seller" ? (
                <ShopManageHome />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          {/* 판매상품 등록 페이지 */}
          <Route
            path="/shop/:shopId/add-product"
            element={
              authUser && authUser.role === "seller" ? (
                <AddProduct />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          {/* 상품정보 수정페이지 */}
          <Route
            path="/shop/edit-product/:id"
            element={
              authUser && authUser.role === "seller" ? (
                <EditProduct />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          {/* 서비스 관리 어드민 페이지 */}
          <Route
            path="/admin"
            element={
              authUser && authUser.role === "admin" ? (
                <AdminHome />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
          {/* 장바구니 담은 상품 페이지  */}
          <Route
            path="/carts"
            element={authUser ? <CartHome /> : <Navigate to={"/logIn"} />}
          />
          {/* 결제 페이지 */}
          <Route
            path="/payment"
            element={authUser ? <Payment /> : <Navigate to={"/logIn"} />}
          />
          {/* 결제 성공 페이지 */}
          <Route
            path={`/payment-success`}
            element={authUser ? <PaymentSuccess /> : <Navigate to={"/logIn"} />}
          />
          {/* 결제 취소 페이지 */}
          <Route
            path={`/payment-cancel`}
            element={authUser ? <PaymentCancel /> : <Navigate to={"/logIn"} />}
          />
          {/* 주문내역 목록 페이지 */}
          <Route
            path={"/order-history"}
            element={
              authUser ? <OrderHistoryPage /> : <Navigate to={"/logIn"} />
            }
          />
        </Routes>
      </main>
      {authUser && !shouldHideRightPanel && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
