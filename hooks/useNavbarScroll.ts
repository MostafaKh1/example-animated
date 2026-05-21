import { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useNavbarScroll = (
  navRef: RefObject<HTMLElement | null>
  
) => {
  useGSAP(() => {



    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const currentScroll = self.scroll();
        const goingDown = self.direction === 1;

        if (currentScroll < 50) {
          gsap.to(navRef.current, {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(navRef.current, {
            y: goingDown ? -100 : 0,
            autoAlpha: goingDown ? 0 : 1,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      },
    });
  });
};