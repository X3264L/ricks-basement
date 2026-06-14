import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rick's Basement",
  description: "A secret command center for Codex."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
