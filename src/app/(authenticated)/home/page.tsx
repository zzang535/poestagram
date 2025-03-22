export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h2 className="text-xl font-bold">환영합니다</h2>
      <p className="text-[#ededed]/70">poe2stagram 홈 페이지입니다.</p>

      {/* 예시 콘텐츠 */}
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="bg-gray-800 p-4 rounded-lg mt-3">
          <h3 className="font-medium">게시물 {item}</h3>
          <p className="text-sm text-[#ededed]/70">샘플 게시물 내용입니다.</p>
        </div>
      ))}
    </div>
  );
}
