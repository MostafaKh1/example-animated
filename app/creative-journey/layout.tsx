import type { Metadata } from "next";
import "./creative-journey.css";

export const metadata: Metadata = {
  title: "Creative Journey — GSAP + Lenis",
  description:
    "Scroll-driven experience: preloader, parallax sections, SVG morph, Lenis smooth scroll",
};

export default function CreativeJourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
