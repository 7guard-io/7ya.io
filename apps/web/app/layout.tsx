import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Igor Vepretski | 7YA",
  description:
    "The staging home of Igor Vepretski, StartOn and the 7YA evidence platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
