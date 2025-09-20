import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import LogInPage from "./pages/auth/logIn/LogInPage";
import Sidebar from "./components/commons/SideBar";
import RightPanel from "./components/commons/RightPannel";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";

function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/logIn" element={<LogInPage />} />
        <Route path="/profile/:userName" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
      <RightPanel />
    </>
  );
}

export default App;
