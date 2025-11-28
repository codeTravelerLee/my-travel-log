//비밀번호 재설정 페이지

import React, { useState } from "react";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>비밀번호를 재설정하려면 먼저 회원 인증을 해야 해요.</p>
      <input
        type="email"
        placeholder="example@google.com"
        name="email"
        value={email}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
      <button>인증하기</button>
    </form>
  );
};

export default ResetPasswordPage;
