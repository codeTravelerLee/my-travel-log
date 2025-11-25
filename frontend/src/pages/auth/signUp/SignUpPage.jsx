import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useMutation, QueryClient } from "@tanstack/react-query";

import LogoSvg from "../../../components/svgs/LogoSvg";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { useUserStore } from "../../../store/useUserStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    fullName: "",
    password: "",
    passwordConfirm: "",
  });

  const navigate = useNavigate();

  const { signUp } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(formData);
      console.log(formData);
      toast.success("회원가입이 완료되었어요");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("다시 시도해주세요!");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <LogoSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <LogoSvg className="w-80 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">
            My Travel Log, <br /> <br />
            나만의 여행 아카이브
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="hello@gmail.com"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="닉네임"
                name="userName"
                onChange={handleInputChange}
                value={formData.userName}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="성함"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="비밀번호"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="비밀번호 확인"
              name="passwordConfirm"
              onChange={handleInputChange}
              value={formData.passwordConfirm}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "회원가입"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg text-center">
            이미 계정이 있으신가요?
          </p>
          <Link to="/logIn">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              로그인 하러 가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
