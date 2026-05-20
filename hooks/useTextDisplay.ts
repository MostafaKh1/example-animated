import { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export const useSectionAnimation = (
    sectionRef: RefObject<HTMLElement | null>
) => {
    useGSAP(() => {
        if (!sectionRef.current) return;

        const elements =
            sectionRef.current.querySelectorAll("h5, p, span");

        const navLinks = document.querySelectorAll(".nav-links");

        elements.forEach((el: any) => {
            const split = new SplitText(el, { type: "words" });

            gsap.from(split.words, {
                opacity: 0,
                y: 15,
                stagger: 0.05,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

      
        const lastElement = elements[elements.length - 1];

        gsap.to(sectionRef.current, {
            backgroundColor: "#171717",
            ease: "none",
            scrollTrigger: {
                trigger: lastElement,
                start: "top 70%",
                toggleActions: "play none none reverse",
            },
        });

     
        ScrollTrigger.create({
            trigger: lastElement,
            start: "top 60%",
            end: "bottom 60%",

            onEnter: () => {
                gsap.to(navLinks, {
                    color: "#E5E7EB",
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto",
                    toggleActions: "play none none reverse",

                });
            },

            onLeaveBack: () => {
                gsap.to(navLinks, {
                    color: "#FDA51F",
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            },
        });
    }, []);
};