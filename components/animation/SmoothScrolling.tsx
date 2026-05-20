// src/components/animation/SmoothScrolling.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Initialise Lenis
    lenisRef.current = new Lenis({
      lerp: 0.08,          // smoothness
      duration: 1.2,       // wheel inertia
      smoothWheel: true,
    });

    // Animation loop for Lenis
    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <>{children}</>;
}
