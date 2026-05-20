"use client";

import Lenis from "lenis";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  CIRCLE_TRANSITIONS,
  GRID_INDICES_H,
  GRID_INDICES_V,
  GRID_SPACING,
} from "@/components/creative-journey/circleTransitions";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Phase = "gate" | "loading" | "live";

type CircleDom = {
  config: (typeof CIRCLE_TRANSITIONS)[number];
  outline: SVGCircleElement | null;
  filled: SVGCircleElement | null;
};

export function CreativeJourneyExperience() {
  const clipPathId = `cj-right-half-${useId().replace(/:/g, "")}`;
  const [phase, setPhase] = useState<Phase>("gate");
  const [counter, setCounter] = useState(0);
  const [preloaderHidden, setPreloaderHidden] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const debug1Ref = useRef<SVGTextElement>(null);
  const debug2Ref = useRef<SVGTextElement>(null);
  const debug3Ref = useRef<SVGTextElement>(null);
  const debug4Ref = useRef<SVGTextElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const circleDomRef = useRef<CircleDom[]>([]);

  const startClickRef = useRef<HTMLAudioElement>(null);
  const preloaderSoundRef = useRef<HTMLAudioElement>(null);
  const scrollSound1Ref = useRef<HTMLAudioElement>(null);
  const scrollSound2Ref = useRef<HTMLAudioElement>(null);
  const scrollSound3Ref = useRef<HTMLAudioElement>(null);
  const hoverSoundRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);

  const scrollSounds = useRef([
    scrollSound1Ref,
    scrollSound2Ref,
    scrollSound3Ref,
  ]);

  const currentSectionRef = useRef(1);
  const counterTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "loading") return;

    document.body.classList.add("cj-loading-active");

    const start = startClickRef.current;
    const preSound = preloaderSoundRef.current;
    void start?.play().catch(() => { });

    let count = 0;
    counterTimerRef.current = setInterval(() => {
      count += 1;
      setCounter(count);
      if (count >= 100) {
        if (counterTimerRef.current) {
          clearInterval(counterTimerRef.current);
          counterTimerRef.current = null;
        }
        setTimeout(() => {
          preSound?.pause();
          if (preSound) preSound.currentTime = 0;
          document.body.classList.remove("cj-loading-active");
          setPhase("live");
        }, 500);
      }
    }, 50);

    void preSound?.play().catch(() => { });

    const bg = bgMusicRef.current;
    const t = window.setTimeout(() => {
      if (bg) {
        bg.volume = 0.5;
        void bg.play().catch(() => { });
      }
    }, 500);

    return () => {
      document.body.classList.remove("cj-loading-active");
      if (counterTimerRef.current) clearInterval(counterTimerRef.current);
      window.clearTimeout(t);
      if (preSound) {
        preSound.pause();
        preSound.currentTime = 0;
      }
    };
  }, [phase]);

  const stopAllScrollSounds = useCallback(() => {
    for (const ref of scrollSounds.current) {
      const el = ref.current;
      if (el && !el.paused) {
        el.pause();
        el.currentTime = 0;
      }
    }
  }, []);

  useEffect(() => {
    if (phase !== "live") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    gsap.ticker.lagSmoothing(0);

    gsap.to(".cj-gradient-reveal", {
      y: "-500vh",
      duration: 2,
      ease: "power2.inOut",
      delay: 0.25,
    });

    gsap.to(".cj-preloader", {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      delay: 1.0,
      onComplete: () => setPreloaderHidden(true),
    });

    const triggers: ScrollTrigger[] = [];
    const sections = gsap.utils.toArray<HTMLElement>(".cj-section");
    sections.forEach((section) => {
      const anim = gsap.to(section, {
        backgroundPositionY: "50%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      if (anim.scrollTrigger) {
        triggers.push(anim.scrollTrigger);
      }
    });

    const hoverSound = hoverSoundRef.current;
    const navItems = navRef.current?.querySelectorAll("li");
    const cleanups: (() => void)[] = [];

    navItems?.forEach((navItem) => {
      const square = navItem.querySelector(".cj-nav-hover-square");
      if (!square) return;

      const onEnter = () => {
        gsap.to(square, { scaleX: 1, duration: 0.3, ease: "power2.out" });
        if (hoverSound) {
          hoverSound.currentTime = 0;
          hoverSound.volume = 0.3;
          void hoverSound.play().catch(() => { });
        }
      };
      const onLeave = () => {
        gsap.to(square, { scaleX: 0, duration: 0.2, ease: "power2.in" });
      };
      navItem.addEventListener("mouseenter", onEnter);
      navItem.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        navItem.removeEventListener("mouseenter", onEnter);
        navItem.removeEventListener("mouseleave", onLeave);
      });
    });

    const getScrollY = () => lenis.animatedScroll;

    const getCurrentSection = () => {
      const scrollY = getScrollY();
      const sectionHeight = window.innerHeight * 2;
      if (scrollY < sectionHeight) return 1;
      if (scrollY < sectionHeight * 2) return 2;
      return 3;
    };

    let scrollTimeout: number | undefined;
    let lastSoundSection = currentSectionRef.current;

    const onScrollSounds = () => {
      const newSection = getCurrentSection();
      if (newSection !== lastSoundSection) {
        stopAllScrollSounds();
        lastSoundSection = newSection;
        currentSectionRef.current = newSection;
      }
      const idx = currentSectionRef.current - 1;
      const currentScrollSound = scrollSounds.current[idx]?.current;
      if (currentScrollSound?.paused) {
        currentScrollSound.currentTime = 0;
        void currentScrollSound.play().catch(() => { });
      }
      if (scrollTimeout !== undefined) window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        stopAllScrollSounds();
      }, 150);
    };

    const circle = glowRef.current;
    const debugLine1 = debug1Ref.current;
    const debugLine2 = debug2Ref.current;
    const debugLine3 = debug3Ref.current;
    const debugLine4 = debug4Ref.current;
    const geometricTexts = document.querySelectorAll(".cj-geometric-text");

    /** Runs every GSAP frame while Lenis scrolls — circles morph with scroll progress. */
    const updateScrollVisuals = () => {
      const scrollY = getScrollY();
      const maxScroll = Math.max(1, lenis.limit);
      const progress = Math.min(scrollY / maxScroll, 1);

      const footerEl = footerRef.current;
      const footerStart = footerEl
        ? footerEl.offsetTop - window.innerHeight
        : 0;
      const footerProgress = Math.max(
        0,
        (scrollY - footerStart) / (window.innerHeight * 0.5),
      );
      const textOpacity = Math.max(0, 1 - footerProgress * 2);
      geometricTexts.forEach((text) => {
        (text as SVGElement).style.opacity = String(textOpacity);
      });

      const freq1 = (432 + progress * 108).toFixed(1);
      const freq2 = (528 - progress * 156).toFixed(1);
      const energy = (progress * 99.9).toFixed(1);
      const presence = ((1 - progress) * 100).toFixed(1);

      let awarenessState: string;
      let becomingState: string;
      let energyState: string;
      let presenceState: string;

      if (progress <= 0.1) {
        awarenessState = `[${freq1}] AWARENESS: SILENCE`;
        becomingState = `.${freq2} STATE: VOID`;
        energyState = `{${energy}} ENERGY: DORMANT`;
      } else if (progress <= 0.25) {
        awarenessState = `[${freq1}] AWARENESS: STIRRING`;
        becomingState = `.${freq2} STATE: EMERGING`;
        energyState = `{${energy}} ENERGY: AWAKENING`;
      } else if (progress <= 0.5) {
        awarenessState = `[${freq1}] AWARENESS: FLOWING`;
        becomingState = `.${freq2} STATE: EXPANDING`;
        energyState = `{${energy}} ENERGY: BUILDING`;
      } else if (progress <= 0.75) {
        awarenessState = `[${freq1}] AWARENESS: ASCENDING`;
        becomingState = `.${freq2} STATE: DISSOLVING`;
        energyState = `{${energy}} ENERGY: RADIATING`;
      } else if (progress <= 0.9) {
        awarenessState = `[${freq1}] AWARENESS: TRANSCENDING`;
        becomingState = `.${freq2} STATE: INFINITE`;
        energyState = `{${energy}} ENERGY: OVERFLOWING`;
      } else {
        awarenessState = `[${freq1}] AWARENESS: UNITY`;
        becomingState = `.${freq2} STATE: ETERNAL`;
        energyState = `{${energy}} ENERGY: PURE`;
      }

      const presenceIntensity = Math.max(0, 1 - progress);
      if (presenceIntensity > 0.8) {
        presenceState = `.${presence} PRESENCE: SOLID`;
      } else if (presenceIntensity > 0.6) {
        presenceState = `.${presence} PRESENCE: SOFTENING`;
      } else if (presenceIntensity > 0.4) {
        presenceState = `.${presence} PRESENCE: TRANSLUCENT`;
      } else if (presenceIntensity > 0.2) {
        presenceState = `.${presence} PRESENCE: ETHEREAL`;
      } else {
        presenceState = `.${presence} PRESENCE: VOID`;
      }

      if (circle) {
        const scale = 1 + progress * 1.6;
        const rot1 = progress * 270;
        const rot2 = -progress * 270;
        const radius = (1 - progress) * 50; // morphs from 50% (circle) to 0% (diamond/square)
        const shadowSize = progress * 180;
        const shadowSpread = progress * 20;

        circle.style.transform = `scale(${scale})`;
        circle.style.transformOrigin = "center center";
        circle.style.boxShadow = `0 0 ${shadowSize}px ${shadowSpread}px rgba(0, 242, 254, ${progress * 0.8}), 0 0 ${shadowSize * 1.5}px ${shadowSpread * 2}px rgba(79, 172, 254, ${progress * 0.4})`;

        circle.style.setProperty("--cj-shape-rot-1", `${rot1}deg`);
        circle.style.setProperty("--cj-shape-rot-2", `${rot2}deg`);
        circle.style.setProperty("--cj-shape-radius", `${radius}%`);
        circle.style.setProperty("--cj-core-rot", `${progress * 180}deg`);
      }

      const gridOpacity = Math.max(0, 0.3 * (1 - progress * 1.5));
      document.querySelectorAll(".cj-grid-line").forEach((line) => {
        line.setAttribute("stroke-opacity", String(gridOpacity));
      });

      circleDomRef.current.forEach((transition, index) => {
        const { initial, final } = transition.config;
        const currentCx = initial.cx + (final.cx - initial.cx) * progress;
        const currentCy = initial.cy + (final.cy - initial.cy) * progress;
        const currentR = initial.r + (final.r - initial.r) * progress;
        const rotation = progress * 360 * (index % 2 === 0 ? 1 : -1);
        const opacity = Math.max(0.1, 1 - progress * 0.7);

        if (transition.outline) {
          transition.outline.setAttribute("cx", String(currentCx));
          transition.outline.setAttribute("cy", String(currentCy));
          transition.outline.setAttribute("r", String(currentR));
          transition.outline.setAttribute(
            "transform",
            `rotate(${rotation} ${currentCx} ${currentCy})`,
          );
          transition.outline.setAttribute("stroke-opacity", String(opacity));
        }
        if (transition.filled) {
          transition.filled.setAttribute("cx", String(currentCx));
          transition.filled.setAttribute("cy", String(currentCy));
          transition.filled.setAttribute("r", String(currentR));
          transition.filled.setAttribute(
            "transform",
            `rotate(${rotation} ${currentCx} ${currentCy})`,
          );
          transition.filled.setAttribute(
            "fill-opacity",
            String(opacity * 0.05),
          );
        }
      });

      if (debugLine1) debugLine1.textContent = awarenessState;
      if (debugLine2) debugLine2.textContent = becomingState;
      if (debugLine3) debugLine3.textContent = energyState;
      if (debugLine4) debugLine4.textContent = presenceState;
    };

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
      updateScrollVisuals();
    };
    gsap.ticker.add(tickerCb);

    const unsubLenisScroll = lenis.on("scroll", onScrollSounds);
    requestAnimationFrame(() => {
      updateScrollVisuals();
      ScrollTrigger.refresh();
    });

    return () => {
      unsubLenisScroll();
      if (scrollTimeout !== undefined) {
        window.clearTimeout(scrollTimeout);
      }
      cleanups.forEach((fn) => fn());
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      triggers.forEach((st) => st.kill());
      stopAllScrollSounds();
      bgMusicRef.current?.pause();
    };
  }, [phase, stopAllScrollSounds]);

  const handleStart = () => {
    setPhase("loading");
    setCounter(0);
  };

  const showGate = phase === "gate";
  const showPreloader = phase === "loading" || phase === "live";
  const showLiveLayers = phase === "live";

  return (
    <div className="creative-journey-page">
      {showGate && (
        <div className="fixed inset-0 w-screen h-screen bg-[#0a0a0a] flex flex-col items-center justify-center z-[2000] font-mono text-xs text-white/90 gap-8 text-center p-4">
          <p className="uppercase tracking-widest leading-relaxed">
            ENTER EXPERIENCE
            <br />
            WITH AUDIO
          </p>
          <button
            type="button"
            className="border border-white/90 bg-transparent text-white/90 px-8 py-4 font-mono text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#0a0a0a]"
            onClick={handleStart}
          >
            START
          </button>
        </div>
      )}

      <div
        className={`fixed inset-0 w-screen h-screen bg-[#0a0a0a] items-center justify-center z-[2000] font-mono text-xs text-white/90 tracking-widest uppercase ${showPreloader && !preloaderHidden ? "flex" : "hidden"}`}
        aria-hidden={preloaderHidden}
      >
        <span>[{counter.toString().padStart(3, "0")}]</span>
      </div>

      <header className="fixed top-0 left-0 w-full h-20 bg-transparent z-[100] flex items-center">
        <div className="w-full h-full px-8 max-md:px-4 grid grid-cols-12 gap-4 items-center max-md:flex max-md:justify-between max-xs:flex-col max-xs:justify-center max-xs:gap-2">
          <div className="col-span-2 relative flex items-center h-8 group cursor-pointer max-md:flex-none">
            <div className="relative w-full h-full">
              <div className="absolute w-[1.8rem] h-[1.8rem] rounded-full bg-white/90 top-1/2 left-0 -translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.445,0.05,0.55,0.95)] group-hover:-translate-x-2" />
              <div className="absolute w-[1.8rem] h-[1.8rem] rounded-full bg-white/90 top-1/2 left-4 -translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.445,0.05,0.55,0.95)] mix-blend-exclusion group-hover:translate-x-2" />
            </div>
          </div>

          <nav className="col-span-4 col-start-4 max-md:flex-none" ref={navRef}>
            <ul className="flex list-none gap-6 flex-wrap max-md:gap-4 max-md:justify-center">
              <li className="relative">
                <a href="#" className="text-white/90 no-underline text-xs font-mono uppercase tracking-widest pl-2 transition-colors duration-200 active:text-white">
                  CREATIVE JOURNEY
                </a>
                <div className="absolute top-1/2 left-0 w-1 h-1 bg-white/90 origin-left -translate-y-1/2 scale-x-0 cj-nav-hover-square" />
              </li>
              <li className="relative">
                <a href="#" className="text-white/90 no-underline text-xs font-mono uppercase tracking-widest pl-2 transition-colors duration-200">
                  ABOUT
                </a>
                <div className="absolute top-1/2 left-0 w-1 h-1 bg-white/90 origin-left -translate-y-1/2 scale-x-0 cj-nav-hover-square" />
              </li>
              <li className="relative">
                <a href="#" className="text-white/90 no-underline text-xs font-mono uppercase tracking-widest pl-2 transition-colors duration-200">
                  SOUND
                </a>
                <div className="absolute top-1/2 left-0 w-1 h-1 bg-white/90 origin-left -translate-y-1/2 scale-x-0 cj-nav-hover-square" />
              </li>
            </ul>
          </nav>

          <div className="col-span-4 col-start-9 text-right max-md:flex-none max-xs:hidden">
            <a href="https://x.com/filipz" target="_blank" rel="noreferrer" className="text-white/90 no-underline text-xs font-mono uppercase tracking-widest transition-opacity duration-300 hover:opacity-70">
              +CONNECT
            </a>
          </div>
        </div>
      </header>

      <div className="cj-gradient-reveal" />

      <audio ref={startClickRef} preload="auto">
        <source
          src="https://assets.codepen.io/7558/preloader-2s-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={preloaderSoundRef} preload="auto">
        <source
          src="https://assets.codepen.io/7558/preloader-5s-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={scrollSound1Ref} loop preload="auto">
        <source
          src="https://assets.codepen.io/7558/glitch-fx-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={scrollSound2Ref} loop preload="auto">
        <source
          src="https://assets.codepen.io/7558/glitch-fx-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={scrollSound3Ref} loop preload="auto">
        <source
          src="https://assets.codepen.io/7558/glitch-fx-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={hoverSoundRef} preload="auto">
        <source
          src="https://assets.codepen.io/7558/preloader-2s-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={bgMusicRef} loop preload="auto">
        <source
          src="https://assets.codepen.io/7558/lxstnght-night-angel.mp3"
          type="audio/mpeg"
        />
      </audio>

      {showLiveLayers && (
        <>
          <div className="fixed inset-0 w-screen h-screen z-50 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 1920 1080"
              preserveAspectRatio="xMidYMid slice"
            >
              <g id="cj-grid-lines">
                {GRID_INDICES_V.map((i) => (
                  <line
                    key={`v-${i}`}
                    className="cj-grid-line"
                    x1={i * GRID_SPACING}
                    y1={0}
                    x2={i * GRID_SPACING}
                    y2={1080}
                  />
                ))}
                {GRID_INDICES_H.map((i) => (
                  <line
                    key={`h-${i}`}
                    className="cj-grid-line"
                    x1={0}
                    y1={i * GRID_SPACING}
                    x2={1920}
                    y2={i * GRID_SPACING}
                  />
                ))}
              </g>
              <g id="cj-circles-outline">
                {CIRCLE_TRANSITIONS.map((config, index) => (
                  <circle
                    key={`o-${index}`}
                    ref={(el) => {
                      const arr = circleDomRef.current;
                      if (!arr[index])
                        arr[index] = { config, outline: null, filled: null };
                      arr[index].outline = el;
                      arr[index].config = config;
                    }}
                    className="cj-circle-outline"
                    cx={config.initial.cx}
                    cy={config.initial.cy}
                    r={config.initial.r}
                  />
                ))}
              </g>
              <g id="cj-circles-filled">
                <clipPath id={clipPathId}>
                  <rect x="960" y="0" width="960" height="1080" />
                </clipPath>
                <g clipPath={`url(#${clipPathId})`}>
                  {CIRCLE_TRANSITIONS.map((config, index) => (
                    <circle
                      key={`f-${index}`}
                      ref={(el) => {
                        const arr = circleDomRef.current;
                        if (!arr[index])
                          arr[index] = { config, outline: null, filled: null };
                        arr[index].filled = el;
                        arr[index].config = config;
                      }}
                      className="cj-circle-filled"
                      cx={config.initial.cx}
                      cy={config.initial.cy}
                      r={config.initial.r}
                    />
                  ))}
                </g>
              </g>

              <text className="cj-geometric-text cj-text-top-left" x="100" y="100">
                THE CREATIVE
              </text>
              <text className="cj-geometric-text cj-text-top-left" x="100" y="115">
                PROCESS
              </text>

              <text className="cj-geometric-text cj-text-top-right" x="1720" y="100">
                THE ESSENCE
              </text>
              <text className="cj-geometric-text cj-text-top-right" x="1720" y="115">
                OF SOUND
              </text>

              <text
                ref={debug1Ref}
                className="cj-geometric-text cj-text-bottom-left"
                x="100"
                y="980"
              >
                AWARENESS: SILENCE
              </text>
              <text
                ref={debug2Ref}
                className="cj-geometric-text cj-text-bottom-left"
                x="100"
                y="995"
              >
                STATE: VOID
              </text>
              <text
                ref={debug3Ref}
                className="cj-geometric-text cj-text-bottom-left"
                x="100"
                y="1010"
              >
                ENERGY: DORMANT
              </text>
              <text
                ref={debug4Ref}
                className="cj-geometric-text cj-text-bottom-left"
                x="100"
                y="1025"
              >
                PRESENCE: SOLID
              </text>

              <text className="cj-geometric-text cj-text-bottom-right" x="1620" y="980">
                BETWEEN THE
              </text>
              <text className="cj-geometric-text cj-text-bottom-right" x="1620" y="995">
                HEARTBEATS
              </text>
            </svg>
          </div>

          <div className="cj-center-shape">
            <div className="cj-shape-container">
              <div className="cj-glowing-shape" ref={glowRef}>
                <div className="cj-shape-ring cj-shape-ring-1" />
                <div className="cj-shape-ring cj-shape-ring-2" />
                <div className="cj-shape-core" />
              </div>
            </div>
          </div>
        </>
      )}

      <section className="cj-section-1 h-[200vh] w-full relative bg-cover bg-center bg-fixed max-md:bg-scroll">
        <div className="relative z-[2] h-full p-8 max-sm:p-4" />
      </section>
      <section className="cj-section-2 h-[200vh] w-full relative bg-cover bg-center bg-fixed max-md:bg-scroll">
        <div className="relative z-[2] h-full p-8 max-sm:p-4" />
      </section>
      <section className="cj-section-3 h-[200vh] w-full relative bg-cover bg-center bg-fixed max-md:bg-scroll">
        <div className="relative z-[2] h-full p-8 max-sm:p-4" />
      </section>

      <footer className="relative w-full min-h-[50vh] bg-[#0a0a0a] z-10 flex flex-col items-center justify-between p-8 max-md:p-4" ref={footerRef}>
        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex justify-between w-full items-start mb-8 max-md:flex-col max-md:gap-8 max-md:text-left">
            <div className="flex flex-col gap-[2px] font-mono text-xs uppercase text-white/90 leading-tight">
              <p>THE DARKNESS</p>
              <p>IS WHERE</p>
              <p>LIGHT IS BORN</p>
              <p>EMPTINESS</p>
              <p>CREATES SPACE</p>
              <p>FOR HEALING</p>
            </div>
            <div className="flex flex-col gap-[2px] font-mono text-xs uppercase text-white/90 leading-tight text-right max-w-[40%] max-md:max-w-full max-md:text-left">
              <p>CREATIVITY FLOWS THROUGH</p>
              <p>INFINITE PATHWAYS</p>
              <p>CONSCIOUSNESS EXPANDS</p>
              <p>INTO BOUNDLESS REALMS</p>
              <p>OF LIGHT AND POSSIBILITY</p>
              <p>WHERE HEALING BECOMES ART</p>
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.7em] text-white/60 text-left mb-4 max-md:text-center max-md:tracking-[0.3em] max-sm:text-[8px] max-sm:tracking-[0.2em]">
            <p>
              Sound Design & Music by{" "}
              <a
                href="https://open.spotify.com/artist/6YXgRMajnjib8j6Cxzcryp?si=iiLnt59BRp6QgKGizkG5Zg"
                target="_blank"
                rel="noreferrer"
                className="text-white/90 no-underline transition-opacity duration-300 hover:opacity-70"
              >
                @LXSTNGHT
              </a>
            </p>
          </div>
        </div>
        <div className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-auto max-w-none"
            src="https://assets.codepen.io/7558/arrival-text.svg"
            alt=""
          />
        </div>
      </footer>
    </div>
  );
}
