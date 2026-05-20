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

        gsap.utils.toArray(elements).forEach((el: any, i, arr) => {
            const element = new SplitText(el, { type: "words" });
            const batchSize = 2;
            const batchIndex = Math.floor(i / batchSize);
            const lastElment = arr[arr.length - 1]
            gsap.from(element.words, {
                opacity: 0, y: 15,
                stagger: 0.06, duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: arr[batchIndex * batchSize] as any,
                    start: "top 85%",
                },
            });

            gsap.to(sectionRef.current, {
                backgroundColor: "#171717",
                scrollTrigger: {
                    trigger: lastElment as HTMLElement,
                    start: "top 70%",
                    toggleActions: 'play none none reverse'
                },
            })
        });
    }, []);
};