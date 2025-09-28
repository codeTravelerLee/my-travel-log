//프로필 페이지에, 특정 유저가 언제 가입했는지 표시하기 위한 함수
//포맷 전 createdAt의 형태: 2025-09-13T04:42:27.333Z

export const formatDateForProfileJoinDate = (createdAt) => {
  const joinedDate = new Date(createdAt); //date객체로 변환

  const year = joinedDate.getFullYear();
  const month = String(joinedDate.getMonth() + 1).padStart(2, "0"); //1일의 경우 01로 표시
  const day = String(joinedDate.getDate()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

//2025-09-13T04:42:27.333Z
