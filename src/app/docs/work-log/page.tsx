"use client";

export default function WorkLogPage() {
  const workLogs = [
    {
      date: "2025-03-30",
      day: "일",
      time: "12:00-15:00",
      hours: 3,
      content: "권한별 페이지 분기, docs 페이지 레이아웃 분기, 댓글 모달 작업",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-30",
      day: "일",
      time: "9:00-12:00",
      hours: 3,
      content: "프로필 페이지, 선개발 후 피그마 방식으로 변경",
      workers: "황윤, 클로드, gpt"
    },
    {
      date: "2025-03-29",
      day: "토",
      time: "19:00-22:00",
      hours: 3,
      content: "비밀번호 찾기 와이어프레임 / 비밀번호 찾기 마크업",
      workers: "황윤, creatie, 클로드, gpt"
    },
    {
      date: "2025-03-22",
      day: "토",
      time: "19:00-22:00",
      hours: 3,
      content: "creatie 테스트, 로그인, 회원가입, 홈, 만들기 페이지 마크업",
      workers: "황윤, creatie, 클로드, gpt"
    },
    {
      date: "2025-03-13",
      day: "목",
      time: "20:00-21:00",
      hours: 2,
      content: "피그마로 와이어프레임 작성",
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
                  <td className="border border-gray-700 px-4 py-2">{log.content}</td>
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