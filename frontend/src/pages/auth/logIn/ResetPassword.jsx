//사용자가 이메일에서 링크를 통해 받은 실제 비밀번호 재설정 페이지

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../../utils/axios/auth";

const ResetPassword = () => {
  const [formValues, setFormValues] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formValues.password !== formValues.passwordConfirm) {
      return toast.error("비밀번호가 일치하지 않아요!");
    }

    try {
      // axios호출로 변경된 비밀번호 DB반영 요청
      await resetPassword(resetToken, formValues.password);

      toast.success("비밀번호가 성공적으로 변경되었어요!");
    } catch (error) {
      toast.error("비밀번호 변경에 실패했어요. 다시 시도해주세요.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p>변경할 새로운 비밀번호를 입력해주세요. </p>
      <input
        type="password"
        placeholder="새 비밀번호를 입력해주세요"
        value={formValues.password}
        name="password"
        onChange={onChange}
        className="border rounded-lg p-4"
      />
      <input
        type="password"
        placeholder="다시 한 번 입력해주세요"
        value={formValues.passwordConfirm}
        name="passwordConfirm"
        onChange={onChange}
        className="border rounded-lg p-4"
      />
      <button
        onClick={onSubmit}
        className="border rounded-lg bg-blue-400 hover:bg-white hover:cursor-pointer hover:text-black font-bold"
      >
        비밀번호 변경
      </button>
    </form>
  );
};

export default ResetPassword;
