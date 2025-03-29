"use client";

export default function CommonSpec() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-12">
      <h1 className="text-3xl font-bold mb-8">📄 공통 디자인 가이드</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">디자인 컨셉</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>중앙 정렬, 세로 배치, 최대 너비 375px</li>
          <li>다크 모드 기반 컬러 스킴</li>
          <li>로고 타이틀에 'Pacifico' 폰트 사용</li>
          <li>강조 색상: 빨강, 링크: 파랑</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">인터랙션 정의</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>입력 필드 focus 시 테두리 강조</li>
          <li>링크 hover 시 underline</li>
        </ul>
      </section>
    </div>
  );
} 