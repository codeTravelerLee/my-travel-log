import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useMutation, QueryClient } from "@tanstack/react-query";

import LogoSvg from "../../../components/svgs/LogoSvg";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    fullName: "",
    password: "",
  });

  const navigate = useNavigate();

  // const queryClient = new QueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, userName, fullName, password }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/auth/signUp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, userName, fullName, password }),
            credentials: "include", //토큰이 담긴 쿠키를 받아오기 위함
          }
        );

        const response = await res.json();

        if (!res.ok || response.error) {
          throw new Error(response.error || "에러 발생");
        }

        //에러 없다면
        console.log(`data looks like: ${JSON.stringify(response)}`);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("회원가입 성공!");
      navigate("/");
      toast("환영해요!", {
        icon: "👏",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
    console.log(formData);
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
              placeholder="Email"
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
                placeholder="Username"
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
                placeholder="Full Name"
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
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
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
