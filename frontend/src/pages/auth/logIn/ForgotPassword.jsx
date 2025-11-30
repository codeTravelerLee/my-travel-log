//비밀번호 재설정 페이지

import React, { useState } from "react";
import { forgotPassword } from "../../../utils/axios/auth";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgotPassword(email);
      toast.success("회원님의 이메일로 재설정 링크를 보냈어요!");
    } catch (error) {
      toast.error("다시 시도해주세요.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full h-full justify-center items-center"
    >
      <div>
        <p className="text-2xl">먼저 회원님의 이메일을 입력해주세요.</p>
      </div>
      <div className="flex gap-4">
        <input
          type="email"
          placeholder="example@google.com"
          name="email"
          value={email}
          onChange={handleChange}
          className="border rounded-lg p-4"
        />

        <button onClick={handleSubmit} className="border rounded-lg p-4">
          인증하기
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
