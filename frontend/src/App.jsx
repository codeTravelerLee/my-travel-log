import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import LogInPage from "./pages/auth/logIn/LogInPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signUp" element={<SignUpPage />} />
      <Route path="/logIn" element={<LogInPage />} />
    </Routes>
  );
}

export default App;
