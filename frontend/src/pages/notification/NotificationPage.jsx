import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/commons/LoadingSpinner";
import { formatDateForPost } from "../../utils/date/formatDateForPost";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  //알림 가져오기
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/notification`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "알림을 가져올 수 없어요");

        return response.notifications; //서버에서 보낸 알림객체가 담긴 배열
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  //알림 전체 삭제 mutation
  const { mutate: deleteAllNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/notification`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "알림을 삭제할 수 없어요");

        return response;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("모든 알림을 지웠어요");
    },
    onError: (error) => {
      toast.error("다시 시도해주세요");
    },
  });

  //알림 하나 삭제 mutation
  const { mutate: deleteOneNotification } = useMutation({
    mutationFn: async (notificationId) => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URI
          }/api/notification/${notificationId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const response = await res.json();

        if (!res.ok || response.error)
          throw new Error(response.error || "알림을 삭제할 수 없어요");

        return response;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("알림을 지웠어요");
    },
    onError: () => {
      toast.error("다시 시도해주세요");
    },
  });

  //알림 전체지우기 이벤트 핸들러
  const handleDeleteEveryNotifications = () => {
    if (confirm("정말 모든 알림을 지울까요?")) {
      deleteAllNotifications(); //mutate: deleteAllNotifications
    }
  };

  //알림 하나 지우기 이벤트 핸들러
  const handleDeleteOneNotification = (notificiationId) => {
    if (confirm("정말 이 알림을 지울까요?")) {
      deleteOneNotification(notificiationId);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">알림</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={handleDeleteEveryNotifications}>모든 알림 지우기</a>
              </li>
            </ul>
          </div>
        </div>
        {/* 로딩중이면 로딩스피너 */}
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {/* 알림이 없는 경우 */}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">아직 알림이 없어요 🤔</div>
        )}
        {/* 알림이 있는 경우 */}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex place-content-between gap-2 p-4">
              <div className="flex gap-2">
                {/* 팔로우 알림인 경우 */}
                {notification.type === "follow" && (
                  <FaUser className="w-7 h-7 text-primary" />
                )}
                {/* 좋아요 알림인 경우 */}
                {notification.type === "like" && (
                  <FaHeart className="w-7 h-7 text-red-500" />
                )}
                <Link to={`/profile/${notification.from.userName}`}>
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={
                          notification.from.profileImg ||
                          "/avatar-placeholder.png"
                        }
                      />
                    </div>
                    <span>{formatDateForPost(notification.createdAt)}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">
                      @{notification.from.userName}
                    </span>{" "}
                    {notification.type === "follow"
                      ? "님이 회원님을 팔로우했어요."
                      : "님이 회원님의 게시물을 좋아합니다!"}
                  </div>
                </Link>
              </div>
              <MdDeleteOutline
                className=""
                onClick={() => {
                  handleDeleteOneNotification(notification._id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
