"use client";

export default function WorkLogPage() {
  const workLogs = [
    {
      date: "2025-04-12",
      day: "토",
      time: "9:00-12:00",
      hours: 3,
      content: "• 피드 업로드 애니메이션 제작\n• 게시물 페이지 api 연동\n• 게시물 페이지 분기 처리\n• 마이 피드 api 유저 단위로 수정",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-04-10",
      day: "목",
      time: "17:00-19:00",
      hours: 2,
      content: "• 피드 생성 기능\n• 프로필 유저 피드 가져오기\n• 프로필 유저 정보 바인딩\n• 프로필 디폴트 이미지 설정",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-04-09",
      day: "수",
      time: "20:00-22:00",
      hours: 2,
      content: "• 피드 모델 생성\n• 피드 / 파일 / 유저 관계 생성\n• 피드 생성 api 더미 연동",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-04-08",
      day: "화",
      time: "20:00-21:00",
      hours: 1,
      content: "• 파일 모델 생성\n• 다중 파일 업로드",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-04-08",
      day: "화",
      time: "11:30-13:30",
      hours: 2,
      content: "• 새 게시물 페이지 ui 초안\n• 파일 1장 s3 업로드 테스트",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-04-07",
      day: "월",
      time: "19:00-22:00",
      hours: 3,
      content: "• 헤더에 타이틀 표현\n• 회원가입 플로우 step 프로세스로 변경\n• 개인정보 처리방침, 이용약관 모달화\n• 개인정보 처리방침, 이용약관 애니메이션 오류 수정\n• 로그인, 회원가입 플로우 피그마에 표현",
      workers: "황윤, 클로드, gpt, 피그마"
    },
    {
      date: "2025-04-07",
      day: "월",
      time: "11:00-13:00",
      hours: 2,
      content: "• 이메일 인증 방식의 로그인 기능 구현\n• 로그인 상태 관리 개선",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-04-05",
      day: "토",
      time: "13:00-16:00",
      hours: 3,
      content: "• 회원가입 제작\n• 회원가입 후 자동 로그인 제작",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-04-01",
      day: "화",
      time: "9:00-11:00",
      hours: 2,
      content: "• 개인정보 처리방침 서버 컴포넌트 제작\n• api 서버 디렉토리 구조 변경\n• privacy 테이블 생성 및 마이그레이션",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-31",
      day: "월",
      time: "23:00-24:00",
      hours: 1,
      content: "• 로그인, 회원가입, 게시물작성, 피드, 프로필 페이지 높이 뷰포트\n• 댓글 모달 레이아웃 조정",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-31",
      day: "월",
      time: "0:00-1:00",
      hours: 1,
      content: "• 이메일 인증코드 전송 api 제작\n• signup 페이지 레이아웃 수정",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-30",
      day: "일",
      time: "15:30-17:30",
      hours: 2,
      content: "• fast api 서버 제작\n• render 배포\n• 이메일 코드 전송 api 연동",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-30",
      day: "일",
      time: "12:00-15:00",
      hours: 3,
      content: "• 권한별 페이지 분기\n• docs 페이지 레이아웃 분기\n• 댓글 모달 작업",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-30",
      day: "일",
      time: "9:00-12:00",
      hours: 3,
      content: "• 프로필 페이지\n• 선개발 후 피그마 방식으로 변경",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-29",
      day: "토",
      time: "19:00-22:00",
      hours: 3,
      content: "• 비밀번호 찾기 와이어프레임\n• 비밀번호 찾기 마크업",
      workers: "황윤, creatie, 클로드, gpt"
    },
    {
      date: "2025-03-22",
      day: "토",
      time: "19:00-22:00",
      hours: 3,
      content: "• creatie 테스트\n• 로그인 페이지 마크업\n• 회원가입 페이지 마크업\n• 홈 페이지 마크업\n• 만들기 페이지 마크업",
      workers: "황윤, creatie, 클로드, gpt"
    },
    {
      date: "2025-03-13",
      day: "목",
      time: "20:00-21:00",
      hours: 2,
      content: "• 피그마로 와이어프레임 작성",
      workers: "황윤"
    }
  ];

  const totalHours = workLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">작업일지</h1>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2 text-left">날짜</th>
                <th className="border border-gray-700 px-4 py-2 text-left">요일</th>
                <th className="border border-gray-700 px-4 py-2 text-left">작업시각</th>
                <th className="border border-gray-700 px-4 py-2 text-left">시간</th>
                <th className="border border-gray-700 px-4 py-2 text-left">내용</th>
                <th className="border border-gray-700 px-4 py-2 text-left">작업자</th>
              </tr>
            </thead>
            <tbody>
              {workLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-900">
                  <td className="border border-gray-700 px-4 py-2">{log.date}</td>
                  <td className="border border-gray-700 px-4 py-2">{log.day}</td>
                  <td className="border border-gray-700 px-4 py-2">{log.time}</td>
                  <td className="border border-gray-700 px-4 py-2">{log.hours}</td>
                  <td className="border border-gray-700 px-4 py-2 whitespace-pre-line">{log.content}</td>
                  <td className="border border-gray-700 px-4 py-2">{log.workers}</td>
                </tr>
              ))}
              <tr className="bg-gray-800 font-semibold">
                <td colSpan={3} className="border border-gray-700 px-4 py-2 text-right">
                  총 작업 시간
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {totalHours}
                </td>
                <td colSpan={2} className="border border-gray-700 px-4 py-2" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 