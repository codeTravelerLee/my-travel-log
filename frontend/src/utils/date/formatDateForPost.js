// createdAt포맷팅
// 표시 형태
// 1시간 이내: 몇 분 전
// 1일 이내: 몇 시간 전
// 7일 이내: 몇 일 전
// 1년 이내: 월/일
// 1년 이상: 년/월/일

// now: 기준 시각 (기본값: 현재)
export function formatDateForPost(createdAt, now = new Date()) {
  const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const diffMs = now - date; // JS에서 date객체 시간연산 하면 밀리초 차이로 결과 나옴
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffHour < 1) {
    return `${diffMin}분 전`;
  }
  if (diffDay < 1) {
    return `${diffHour}시간 전`;
  }
  if (diffDay < 7) {
    return `${diffDay}일 전`;
  }

  // 월/일, 년/월/일 표기
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작
  const day = date.getDate();
  const nowYear = now.getFullYear();

  if (year === nowYear) {
    return `${month}월 ${day}일`;
  }
  return `${year}년 ${month}월 ${day}일`;
}
