import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karmic Canteen - Meal Management System",
  description: "Reduce food waste and manage canteen meals efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
