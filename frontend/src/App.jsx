import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

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

import Sidebar from "./components/commons/SideBar";
import RightPanel from "./components/commons/RightPannel";
import LoadingSpinner from "./components/commons/LoadingSpinner";

import { Toaster } from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./utils/tanstack/getCurrentUser";

function App() {
  //프론트엔드에서 protected route를 위한 <현재 로그인된 유저 정보 받아오기>
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    retry: false, //fetching 실패해도 재요청 안보냄
  });

  //rightPanel을 숨길 경로 지정
  const location = useLocation();
  const { pathname } = location;

  const hideRightPanelRoutes = [
    "/products",
    "/product",
    "/shops",
    "/admin",
    "/carts",
  ];

  const shouldHideRightPanel = hideRightPanelRoutes.some((path) => {
    return pathname.includes(path);
  });

  if (isLoading) {
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
              !isLoading && authUser ? <HomePage /> : <Navigate to={"/logIn"} />
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
            path="/carts/:id"
            element={authUser ? <CartHome /> : <Navigate to={"/logIn"} />}
          />
        </Routes>
      </main>
      {authUser && !shouldHideRightPanel && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
