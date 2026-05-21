import { useState, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export const MobileMenu = () => {
    const [toggleMobile, setToggleMobile] = useState(false);

    const divRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mobileNav = divRef.current;
            if (!mobileNav) return;

            const navLinks = mobileNav.querySelectorAll(".nav-links-mobile");

            // ✅ Target the elements you actually want to recolor
            const title = document.querySelector(".mobile-title");
            const button = document.querySelector(".toggle-menu");

            const tl = gsap.timeline();

            if (toggleMobile) {
                gsap.set(mobileNav, {
                    height: "0dvh",
                    autoAlpha: 1,
                    pointerEvents: "auto",
                });

                // ✅ Animate title & button color on open
                tl.to([title, button], {
                    color: "#38493A",
                    duration: 0.3,
                });

                gsap.set(navLinks, { autoAlpha: 0, y: 40 });

                tl.to(mobileNav, {
                    height: "100dvh",
                    duration: 0.8,
                    ease: "power2.out",
                });

                tl.to(navLinks, {
                    autoAlpha: 1,
                    y: 0,
                    color: "#38493A", // ✅ color on open

                    stagger: 0.08,
                    duration: 0.6,
                });

            } else {
                tl.to(navLinks, {
                    autoAlpha: 0,
                    color: "#FDA51F", // ✅ color on close
                    y: 20,
                    duration: 0.2,
                }).to(mobileNav, {
                    height: "0%",
                    duration: 0.6,
                    ease: "power2.inOut",
                    pointerEvents: "none",
                });

                // ✅ Revert title & button color on close
                tl.to([title, button, navLinks], {
                    color: "#FDA51F",
                    duration: 0.3,
                });
            }
        },
        { dependencies: [toggleMobile] }
    );

    return (
        <nav className="flex justify-between items-center  text-[#FDA51F]">
            <h1 className="   font-bold mobile-title text-7xl relative top-[-10] z-[60]">
                The Forest
            </h1>

            <button
                onClick={() => setToggleMobile(!toggleMobile)}
                className="cursor-pointer toggle-menu z-[60] fixed top-6 right-1"
            >
                <span className=" text-xs p-4 uppercase">
                    {toggleMobile ? "Close" : "Menu ."}
                </span>
            </button>

            <div
                ref={divRef}
                className="fixed mobile-nav inset-0 z-50 flex flex-col justify-center items-center bg-[#FDA51F] overflow-hidden"
            >
                <ul className="flex flex-col items-center  gap-4">
                    {["ABOUT", "WORK", "FOREST", "UPDATE", "CONTACT"].map((item) => (
                        <li key={item}>
                            <a
                                href={`#${item.toLowerCase()}`}
                                className="nav-links-mobile   tracking-[0.2em] font-semibold py-2 block text-xl uppercase  "
                            >
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};