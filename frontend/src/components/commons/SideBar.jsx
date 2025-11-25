import { Link } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import toast from "react-hot-toast";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { FaShoppingBag } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";

const Sidebar = () => {
  // const navigate = useNavigate(); //app.jsx의 조건부 렌더링으로 대체

  const { authUser, logOut } = useUserStore();

  //로그아웃 아이콘 클릭시
  const onLogOutBtnClick = async () => {
    if (confirm("정말 로그아웃 하실건가요?")) {
      try {
        await logOut();
        toast.success("로그아웃 되었어요");
      } catch (error) {
        toast.error("다시 시도해주세요!");
      }
    }
  };

  return (
    // 고정 너비로 설정하고 플렉스에서 줄어들지 않도록 설정
    <div className="w-20 md:w-56 flex-shrink-0">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-56">
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
              <FaShoppingBag className="w-6 h-6" />
              <span className="text-lg hidden md:block">여행상품</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/carts`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaShoppingCart className="w-6 h-6" />
              <span className="text-lg hidden md:block">장바구니</span>
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
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/order-history`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaHistory className="w-6 h-6" />
              <span className="text-lg hidden md:block">주문내역</span>
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
          {/* 어드민 권한일 경우에만 서비스 관리 탭 노출  */}
          {authUser.role === "admin" ? (
            <li className="flex justify-center md:justify-start">
              <Link
                to={`/admin`}
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <RiAdminLine className="w-6 h-6" />
                <span className="text-lg hidden md:block">서비스 관리</span>
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
              onClick={onLogOutBtnClick}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
