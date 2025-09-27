import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const { follow, isFollowing } = useFollow();

  const { data: suggestedUSers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/recommend`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "에러 발생");

        return response.recommended; //서버에서 보내는 응답객체 구조에서 recommend에 추천유저 배열 넣음
      } catch (error) {
        console.error(
          `error happened while getting suggested users...:${error.message}`
        );
        throw error;
      }
    },
  });

  //없어도 자리는 차지하게 div줘야 나머지 UI안깨짐
  if (suggestedUSers?.length === 0) return <div className="md:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">이런 친구들은 어떠세요?</p>
        <div className="flex flex-col gap-4">
          {/* 추천 사용자 띄워줌 */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUSers?.map((user) => (
              <Link
                to={`/profile/${user.userName}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.userName}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(); //custom hook
                    }}
                  >
                    {isFollowing ? <LoadingSpinner size="md" /> : "팔로우하기"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
