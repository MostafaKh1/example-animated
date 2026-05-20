"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    const target = { val: 0 };

    tl.to(target, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = Math.round(target.val).toString();
        }
      }
    })
      .to(preloaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut",
        delay: 0.2
      });
  }, []);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#38493A] text-[#FDA51F]"
    >
      <div className="font-serif text-[120px] md:text-[200px] tracking-tighter flex items-start leading-none">
        <span ref={counterRef}>0</span>
        <span className="text-2xl md:text-5xl mt-4 md:mt-8">%</span>
      </div>
      <div className="absolute bottom-10 text-[10px] tracking-[0.4em] uppercase text-white/50">
        Loading Experience
      </div>
    </div>
  );
}
