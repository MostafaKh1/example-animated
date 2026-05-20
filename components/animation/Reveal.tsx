"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Match site utility classes: eleX | eleXReverse | eleY | eleY30 */
  variant?: "eleX" | "eleXReverse" | "eleY" | "eleY30";
  delay?: number;
};

export function Reveal({
  children,
  className = "",
  variant = "eleY",
  delay = 0,
}: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const from: { autoAlpha: number; ease: string; duration: number; x?: number; y?: number } = {
        autoAlpha: 0,
        ease: "power3.out",
        duration: 1,
      };
      if (variant === "eleX") from.x = 40;
      if (variant === "eleXReverse") from.x = -40;
      if (variant === "eleY") from.y = 50;
      if (variant === "eleY30") from.y = 30;

      gsap.set(root, from);

      const tl = gsap.timeline({ paused: true, delay });
      tl.to(root, { x: 0, y: 0, autoAlpha: 1 });

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom bottom",
        onEnter: () => tl.play(),
        once: true,
      });

      return () => {
        st.kill();
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [variant, delay] },
  );

  return (
    <div ref={rootRef} className={`_eleWrap ${className}`.trim()}>
      {children}
    </div>
  );
}
