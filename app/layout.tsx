import type { Metadata } from "next";
import "./tree.css";

export const metadata: Metadata = {
  title: "默契圣诞树 · 把懂你的人，挂在星光里",
  description: "自由出题，邀请朋友答题，把你们的默契挂上圣诞树。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
