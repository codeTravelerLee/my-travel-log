import { useState } from "react";
import toast from "react-hot-toast";

const EditProfileModal = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        프로필 수정하기
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">프로필 정보 수정</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("프로필 업데이트 성공!");
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="성함을 입력해주세요"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="사용하실 유저네임을 입력해주세요."
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.userName}
                name="userName"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="ex@email.com"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="프로필 한줄소개"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="기존 비밀번호"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              {/* <button onClick={}>검증하기</button> */}
            </div>
            <input
              type="password"
              placeholder="새로 사용할 비밀번호"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.newPassword}
              name="newPassword"
              onChange={handleInputChange}
            />

            <input
              type="text"
              placeholder="프로필에 외부 사이트 링크를 남겨보세요!"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button className="btn btn-primary rounded-full btn-sm text-white">
              수정하기
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">닫기</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
