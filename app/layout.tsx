import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Counterspell",
  description: "Text game inspired by Unseen University from Discworld",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} antialiased`}>
        <TopBar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
