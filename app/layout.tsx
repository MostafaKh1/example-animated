import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css"
import SmoothScrolling from "@/components/animation/SmoothScrolling";
import MusicPlayer from "@/components/animation/MusicPlayer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],

});

export const metadata: Metadata = {
  title: " The Silent Echo of the Forest — GSAP learning clone",
  description:
    "Homepage motion study: hero parallax, scroll reveals, sticky nav, marquee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased `}>
      <body className="min-h-full font-sans">
        <SmoothScrolling>{children}</SmoothScrolling>
        <MusicPlayer />
      </body>
    </html>
  );
}
