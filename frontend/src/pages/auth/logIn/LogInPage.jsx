import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/auth/logIn`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
          }
        );

        const response = await res.json();

        //prettier-ignore
        if (!res.ok || response.error) throw new Error(response.error || "알 수 없는 에러가 발생했습니다.");

        console.log(`logged in user data: ${JSON.stringify(response)}`);

        return response;
      } catch (error) {
        console.log(`error happend!: ${error}`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("로그인 성공!");
      navigate("/");
      toast("환영해요!", {
        icon: "👏",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">
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
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "로그인"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
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
