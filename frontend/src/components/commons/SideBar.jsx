import LogoSvg from "../svgs/LogoSvg";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getCurrentUser } from "../../utils/tanstack/getCurrentUser";

const Sidebar = () => {
  // const navigate = useNavigate(); //app.jsx의 조건부 렌더링으로 대체

  const queryClient = useQueryClient();

  const { mutate: logOutMutate } = useMutation({
    //로그아웃
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/auth/logOut`,
          {
            method: "POST",
            credentials: "include", //쿠키를 주고받기 때문(로그아웃은 쿠키의 유효기간을 0으로 하는 것)
          }
        );

        //prettier-ignore
        if(!res.ok) throw new Error("알 수 없는 에러가 발생하였습니다.")
      } catch (error) {
        console.log(`error logging out: ${error}`);
        throw error;
      }
    },
    onSuccess: () => {
      //로그아웃 했으니 인증정보 무효화(authUser키를 가진 query를 재수행함)
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success("로그아웃 되었습니다.");

      // navigate("/signUp"); //어차피 App.jsx에서 자동이동되도록 설정
    },
    onError: () => {
      toast.error("다시 시도해 주세요.");
    },
  });

  //전역 상태에서 데이터 가져오기
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
  });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <p className="text-center font-bold pt-4">MY TRAVEL LOG</p>
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">여행기록</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">알림</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/products"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaShoppingCart className="w-6 h-6" />
              <span className="text-lg hidden md:block">여행상품</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.userName}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">프로필</span>
            </Link>
          </li>
          {/* 판매자 권한일 경우에만 가게 관리 탭 노출  */}
          {authUser.role === "seller" ? (
            <li className="flex justify-center md:justify-start">
              <Link
                to={`/shop/${authUser?._id}`}
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <FaUser className="w-6 h-6" />
                <span className="text-lg hidden md:block">가게 관리</span>
              </Link>
            </li>
          ) : null}
        </ul>
        {authUser && (
          <>
            <Link
              to={`/profile/${authUser.userName}`}
              className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
            >
              <div className="avatar hidden md:inline-flex">
                <div className="w-8 rounded-full">
                  <img
                    src={authUser?.profileImg || "/avatar-placeholder.png"}
                  />
                </div>
              </div>
              <div className="flex justify-between flex-1">
                <div className="hidden md:block">
                  <p className="text-white font-bold text-sm w-20 truncate">
                    {authUser?.fullName}
                  </p>
                  <p className="text-slate-500 text-sm">
                    @{authUser?.userName}
                  </p>
                </div>
              </div>
            </Link>
            <BiLogOut
              className="w-5 h-5 cursor-pointer"
              onClick={() => {
                if (confirm("정말 로그아웃 하실건가요?")) logOutMutate();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
