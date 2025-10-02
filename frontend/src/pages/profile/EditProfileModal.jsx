import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/commons/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const navigate = useNavigate();

  //수정 모달창을 처음 열면, 각 폼엔 기존 정보로 채워져있도록
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        userName: authUser.userName || "",
        email: authUser.email || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();

  //프로필사진, 커버사진을 제외한 모든 수정된 정보를 반영하는 쿼리
  const { mutate: editProfile, isPending } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "다시 시도해주세요");

        return response.updatedProfile;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      toast.success("프로필 수정 성공!");

      document.getElementById("edit_profile_modal").close(); //수정다하면 모달 닫기

      //formData초기화
      setFormData({
        fullName: "",
        userName: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
      });

      //UI 즉각 업데이트
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({
          queryKey: ["userProfile", data.userName],
        }),
      ]);
      navigate(`/profile/${data.userName}`); //사용자가 userName자체를 바꿔버리면, 아예 페이지를 바꿔줘야함.
    },
    onError: () => {
      toast.error("다시 시도해주세요.");
    },
  });

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        {isPending ? <LoadingSpinner size="sm" /> : "프로필 수정하기"}
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">프로필 정보 수정</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              editProfile(formData); //입력한 정보를 db에 반영하는 mutateFn
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
            <button
              className="btn btn-primary rounded-full btn-sm text-white"
              type="submit"
            >
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
