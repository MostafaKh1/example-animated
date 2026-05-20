"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Vertical travel in em units (site uses scrub parallax) */
  travelEm?: number;
};

export function ParallaxImage({
  src,
  alt,
  className = "",
  travelEm = 6,
}: ParallaxImageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      if (!section || !inner) return;

      const tl = gsap.timeline();
      tl.to(inner, { y: `${travelEm}em`, ease: "none" });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "0% 50%",
        end: "100% 28%",
        scrub: 1,
        animation: tl,
      });

      return () => st.kill();
    },
    { scope: sectionRef, dependencies: [travelEm] },
  );

  return (
    <div
      ref={sectionRef}
      className={`full_bg _parallax relative overflow-hidden ${className}`}
    >
      <div ref={innerRef} className="full_bg relative h-full w-full">
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </div>
    </div>
  );
}
