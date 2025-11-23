import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LogoSvg from "../../../components/svgs/LogoSvg";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import toast from "react-hot-toast";
import { useUserStore } from "../../../store/useUserStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { logIn, loading, error } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await logIn(formData.email, formData.password);

    navigate("/");
    toast.success(`${user.userName}님, 환영해요!`);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* <div className="flex-1 hidden lg:flex items-center  justify-center">
        <LogoSvg className="lg:w-1 fill-white" />
      </div> */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <LogoSvg className="w-80 " />
          <h1 className="text-4xl font-extrabold text-white text-center">
            로그인해주세요.
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="이메일을 입력해 주세요."
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="비밀번호를 입력해 주세요."
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button
            className="btn rounded-full btn-primary text-white"
            disabled={loading}
          >
            {loading ? "Loading..." : "로그인"}
          </button>
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">처음이신가요?</p>
          <Link to="/signUp">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              회원가입 하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
