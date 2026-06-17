import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProjectMaterialBuilder",
  description: "项目材料自动生成工作台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

