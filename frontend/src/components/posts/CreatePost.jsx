import { CiImageOn } from "react-icons/ci";

import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useUserStore } from "../../store/useUserStore";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const queryClient = useQueryClient();

  //현재 로그인된 유저의 정보 -> 프로필 사진을 표시하기 위함.
  const { authUser: currentUser } = useUserStore();

  const {
    mutate: createPost,
    isPending: isCreating,
    error,
    isError,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/posts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, img }),
            credentials: "include",
          }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "에러발생");

        return response;
      } catch (error) {
        console.error(`failed to create post: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      setImg(null);
      setText(""); //게시글 올리면 입력 폼은 비워주기
      toast.success("게시글 작성 완료!");
      queryClient.invalidateQueries({ queryKey: ["posts"] }); //작성한 글 반영해 UI최신화
    },
    onError: () => {
      toast.error("다시 시도해주세요");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img }); //mutate: createPost
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setImg(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={
              currentUser.profileImg ||
              "../../assets/profile/avatar-placeholder.png"
            }
          />
        </div>
      </div>
      {/* 입력 폼 */}
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        {/* 본문 */}
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="여행지에서 어떤 특별한 경험을 하셨나요?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {/* 사진을 고른 경우 */}
        {img && (
          <div className="relative w-72 mx-auto">
            {/* X버튼. 누르면 고른 사진 취소 */}
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            {/* 선택한 사진 미리보기 */}
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        {/* 사진을 안골라도 보이는 영역. 사진을 고르는 버튼  */}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            {/* 이 아이콘을 누르면 hidden땜에 숨겨진 file input이 클릭됨 */}
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            {/* <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" /> */}
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isCreating ? "업로드중..." : "추억 남기기"}
          </button>
        </div>
        {isError && <div className="text-red-500">다시 시도해 주세요</div>}
      </form>
    </div>
  );
};
export default CreatePost;
