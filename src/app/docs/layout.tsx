"use client";

import DocsNav from "@/components/DocsNav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DocsNav />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
} 