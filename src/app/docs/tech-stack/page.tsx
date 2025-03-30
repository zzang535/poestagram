"use client";

export default function TechStackPage() {
  const technologies = [
    {
      category: "프론트엔드",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
    },
    {
      category: "백엔드",
      items: ["Fast API", "Python"]
    },
    {
      category: "인프라",
      items: ["Render", "GitHub"]
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">기술 스택</h1>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-lg font-semibold text-white">{tech.category}</h3>
              <div className="flex flex-wrap gap-2">
                {tech.items.map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 