import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import LogInPage from "./pages/auth/logIn/LogInPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";

import Sidebar from "./components/commons/SideBar";
import RightPanel from "./components/commons/RightPannel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/commons/LoadingSpinner";

function App() {
  //프론트엔드에서 protected route를 위한 <현재 로그인된 유저 정보 받아오기>
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/auth/getCurrentUser`,
          {
            method: "POST",
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
    },
    retry: false, //fetching 실패해도 재요청 안보냄
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/logIn"} />}
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
          element={authUser ? <NotificationPage /> : <Navigate to={"/logIn"} />}
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
