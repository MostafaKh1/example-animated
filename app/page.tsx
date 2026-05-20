"use client";

import { useRef } from "react";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { useSectionAnimation } from "@/hooks/useTextDisplay";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Preloader from "@/components/animation/Preloader";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Home() {
  const navRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLHeadElement>(null);

  useNavbarScroll(navRef);
  useSectionAnimation(sectionRef)

  useGSAP(() => {
    if (!heroRef.current) return;
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });
  }, []);


  return (
    <div>
      <Preloader />
      {/* Top Navigation Bar */}
      <div className="fixed top-0 z-50 w-full h-24" ref={navRef as any}>
        {/* Navigation Links */}
        <nav className="  py-12 flex items-center " >
          <ul className="flex justify-between px-24 font-medium w-full list-none">
            {["ABOUT", "WORK", "FOREST", "UPDATE", "CONTACT"].map((item) => {
              const MiddleItem = item === "FOREST";
              return <li key={item} className="relative group">
                <a

                  href={`#${item.toLowerCase()}`}
                  className={` nav-links  text-[#FDA51F]    tracking-[0.2em] transition-colors duration-300 uppercase py-2 block ${MiddleItem ? "font-bold text-4xl" : "text-[10px]"
                    }`}
                >
                  {item}
                </a>
              </li>
            })}
          </ul>
        </nav>
      </div>

      <section ref={heroRef}>
        <header
          className="relative w-full h-screen flex flex-col  text-white overflow-hidden font-sans bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.webp')" }}
        >
          {/* Dark gradient overlay inside header */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-0" />
          <div className="absolute inset-0 bg-radial-vignette z-0 pointer-events-none" />



          {/* Centered Hero Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 text-center">
            <div className="max-w-4xl flex flex-col items-center">
              {/* Tagline */}
              {/* <span className="text-xs font-bold tracking-[0.4em] text-[#FDA51F] uppercase mb-6 bg-[#a52c45]/10 border border-[#FDA51F]/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
              FOREST LIVING EXPERIENCE
            </span> */}

              <h1 className="text-3xl sm:text-6xl md:text-4xl font-extralight tracking-tight leading-none uppercase mb-8">
                The Silent Echo <br />
                <span className="font-semibold text-white">of the Forest</span>
              </h1>

              <p className="text-sm sm:text-base md:text-md  text-white/60 font-light leading-relaxed max-w-xl mb-12">
                Step into an immersive architectural consciousness study where motion, code, and nature converge to form healing spaces and activate the senses.
              </p>

              {/* Call to Actions */}

            </div>
          </div>

          {/* Bottom Scroll Indicator */}

        </header>
      </section>
      <main className="bg-noise">
        <section ref={sectionRef} className="relative z-10 bg-[#38493A] min-h-screen bg-noise">
          <div className="text-center flex flex-col gap-4 justify-center items-center mx-auto pt-24 text-[#FDA51F]">
            <h5 className="text-sm">FOREST</h5>
            <p className="uppercase font-semibold tracking-widest  text-4xl lg:text-7xl lg:max-w-[1200px]">A sanctuary where the rhythms of code and nature breathe life into space.</p>
          </div>
          <div className="flex w-full mt-24 pt-6 px-8 pb-32">
            <div className=" min-w-1/5 lg:min-w-1/2" />
            <div className="flex flex-col flex-1 gap-6 text-white/80 text-lg sm:text-xl font-light leading-relaxed pr-8 md:pr-16">
              {[
                "Merlin — a Code Boutique from Amsterdam. Founded in 2018 to prove what’s possible.",
                "We exist to redefine what “good” means by raising the bar through the work itself.",
                "We work with extraordinary brands and creative teams who refuse to settle. Those who see digital as identity and long-term advantage.",
                "At our core is deep, multidisciplinary craft. We bring motion-first design and code together as one practice, shaped by specialists who care deeply about every decision.",
                "Merlin helps you maximize your digital potential, transforming design, technology, and motion into expressive, reliable, and future-ready experiences.",
                "We prove what’s possible through care, courage, and relentless craft.",
                "Imagine. Code. Magic.",
              ].map((line, i) => (
                <span key={i} className="text-[#FDA51F]  font-medium  max-w-[650px]">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ProjectsSection />

      </main>
    </div>
  );
}
