import { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useNavbarScroll = (
  navRef: RefObject<HTMLElement | null>
) => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    let lastScroll = 0;

    ScrollTrigger.create({
      start: 0,
      end: "max",

      onUpdate: (self) => {
        const currentScroll = self.scroll();

        gsap.to(navRef.current, {
          y: currentScroll > lastScroll ? -100 : 0,
          autoAlpha: currentScroll > lastScroll ? 0 : 1,
          duration: 0.3,
        });

        lastScroll = currentScroll;
      },
    });
  });
};