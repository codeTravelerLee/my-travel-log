import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/posts/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../utils/tanstack/getCurrentUser";
import toast from "react-hot-toast";
import { formatDateForProfileJoinDate } from "../../utils/date/formatDateForProfile";
import Post from "../../components/posts/Post";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../../components/commons/LoadingSpinner";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("작성한 글"); //프로필 탭 내에서, 프로필 주인이 작성한 글, 좋아요 누른 글을 구분해서 보여주는 탭에 사용

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const queryClient = useQueryClient();

  const { userName } = useParams();

  //특정 userName에 해당하는 사용자 정보를 가져옴
  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile", userName], //userName이 바뀌면 새로운 사용자 정보로 refetch됨
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/profile/${userName}`,
          {
            credentials: "include",
          }
        );

        const response = await res.json();
        if (!res.ok)
          throw new Error(
            response.error || "userName에 해당하는 사용자 정보 불러오기 실패"
          );

        return response.user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  //userName이 변하면 프로필 정보 다시 불러옴
  useEffect(() => {
    refetch();
  }, [userName, refetch]);

  //현재 로그인된 사용자 정보 가져옴
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
  });

  //현재 로그인된 사용자가 프로필 페이지의 주인인지 확인
  const isMyProfile = authUser?._id === user?._id;

  //모달창이 아닌, 현재 페이지에서 수정 가능한 프로필사진, 커버사진 업뎃을 반영하는 쿼리
  const {
    mutate: updateProfileOrCoverImg,
    isPending: isUpdatingProfileOrCoverImg,
  } = useMutation({
    mutationFn: async ({ profileImg, coverImg }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ profileImg, coverImg }),
            credentials: "include",
          }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "에러 발생");

        return response.updatedProfile;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      toast.success("프로필이 성공적으로 업데이트 되었어요!");
      setProfileImg(null);
      setCoverImg(null);

      //변경된 프로필 정보로 다시 불러오기
      Promise.all([
        //현재 페이지의 프로필 정보
        queryClient.setQueryData(["userProfile", userName], data),
        //사이드바의 내 프로필 사진도 변경된 사진으로 바꿔주기 위해서, authUser쿼리도 무효화
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: () => {
      toast.error("다시 시도해주세요.");
    },
  });
  //팔로우 기능 커스텀 훅 호출
  const { follow, isPending, isError } = useFollow();

  //현재 로그인된 사용자가 조회한 프로필을 이미 팔로우중인지 확인
  const isAlradyFollowing = authUser?.following?.includes(user?._id);

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">
            존재하지 않는 사용자입니다.
          </p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500"></span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {/* 내 프로필이면 커버이미지 수정 가능 */}
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {/* 내 프로필이면 프로필 이미지 수정 가능 */}
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {/* 내 프로필이면 프로필 수정 가능, 커버이미지나 프로필 이미지 수정중인 경우엔 모달창으로 넘어가는 버튼 숨기기  */}
                {isMyProfile && !profileImg && !coverImg && (
                  <EditProfileModal authUser={authUser} />
                )}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => {
                      follow(user._id); //useFollow커스텀 훅에서 가져온 mutate함수

                      // 팔로우 언팔로우 각 상황에 맞는 토스트 띄우기
                      if (authUser?.following?.includes(user?._id)) {
                        if (confirm("정말 언팔로우 하실건가요?"))
                          toast.success(
                            `이제 ${user.fullName}님을 더이상 팔로우하지 않아요.`
                          );
                      } else {
                        toast.success("팔로우 성공!");
                      }
                    }}
                  >
                    {/* 이미 팔로우중이면 언팔로우, 아니면 팔로우라는 글자를 띄워주기 */}
                    {isPending && (isAlradyFollowing || !isAlradyFollowing) && (
                      <LoadingSpinner size="sm" />
                    )}
                    {!isPending && isAlradyFollowing && "언팔로우"}
                    {!isPending && !isAlradyFollowing && "팔로우"}
                  </button>
                )}
                {isError ? toast.error("다시 시도해주세요") : null}
                {/* 사용자가 새로 업데이트한 이미지가 있으면 프로필 업데이트 버튼 활성화 */}
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => {
                      updateProfileOrCoverImg({ profileImg, coverImg }); //프로필사진 및 커버사진을 업데이트 하는 mutate함수
                    }}
                  >
                    {isUpdatingProfileOrCoverImg ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      "수정하기"
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.userName}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={user.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {formatDateForProfileJoinDate(user.createdAt)}에
                      가입했어요.
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="text-slate-500 text-xs">팔로워</span>
                    <span className="font-bold text-xs">
                      {user?.followers.length}명
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-slate-500 text-xs">팔로잉</span>
                    <span className="font-bold text-xs">
                      {user?.following.length}명
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                {/* 해당 사용자가 작성한 글을 모아주는 탭 */}
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("작성한 글")}
                >
                  작성한 글
                  {feedType === "작성한 글" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                {/* 프로필 주인장이 좋아요 누른 글만 모아주는 탭 */}
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("좋아하는 글")}
                >
                  좋아하는 글
                  {feedType === "좋아하는 글" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
              {/* 탭 전환에 따라 게시글을 보여줌 -> Posts의 내부 로직 재활용 */}
              <Posts
                feedType={feedType}
                userName={userName}
                userId={user._id}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
