import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next JWT Auth",
  description: "JWT Authentication with Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className="dark antialiased">{children}</body>
      </html>
      <Toaster position="top-right" duration={2000} richColors />
    </>
  );
}
