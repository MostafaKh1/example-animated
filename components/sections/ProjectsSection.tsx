"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);


const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="14"
    fill="none"
    viewBox="0 0 24 14"
  >
    <path
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 1L23 7L17 13M23 7H1"
    />
  </svg>
);

interface SpinningLogoProps {
  outerSpeed?: number;
  innerSpeed?: number;
  text?: string;
}

const SpinningLogo = ({
  outerSpeed = 20,
  innerSpeed = 25,
  text,
}: SpinningLogoProps) => {
  const outerRef = useRef<SVGSVGElement>(null);
  const innerRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    gsap.to(outerRef.current, {
      rotation: 360,
      duration: outerSpeed,
      repeat: -1,
      ease: "none"
    });
    gsap.to(innerRef.current, {
      rotation: -360,
      duration: innerSpeed,
      repeat: -1,
      ease: "none"
    });
  }, [outerSpeed, innerSpeed]);

  return (
    <div className="relative w-[100px] h-[100px] flex items-center justify-center text-white/80 shrink-0">

      <div className="absolute inset-0 flex items-center justify-center scale-[1.3]">
        <svg ref={outerRef} className="anim-text" width="72" height="71" viewBox="0 0 72 71" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M40.4373 70.98C38.9573 70.98 37.4573 70.78 35.9873 70.37L19.0173 65.68C14.1973 64.35 10.3073 60.99 8.32726 56.47L1.34726 40.52C-0.632742 35.99 -0.422742 30.92 1.92726 26.61L10.1973 11.41C12.5473 7.09996 16.6973 4.12997 21.6073 3.27997L38.8973 0.269965C43.7973 -0.580035 48.7773 0.789965 52.5473 4.03997L65.8173 15.49C69.5873 18.74 71.6373 23.42 71.4373 28.33L70.7173 45.62C70.5173 50.52 68.0873 54.98 64.0673 57.85L49.8873 67.95C47.0973 69.94 43.7973 70.97 40.4373 70.97V70.98ZM38.9473 1.06996L21.7473 4.05997C17.0773 4.86997 13.1273 7.68996 10.8973 11.78L2.63726 26.99C0.407258 31.08 0.207258 35.9 2.08726 40.2L9.06726 56.15C10.9473 60.45 14.6573 63.65 19.2373 64.91L36.2073 69.6C40.7873 70.87 45.6073 70.03 49.4373 67.3L63.6173 57.2C67.4373 54.47 69.7373 50.24 69.9273 45.59L70.6473 28.3C70.8373 23.64 68.8873 19.19 65.3073 16.1L52.0973 4.70997L38.9473 1.07996V1.06996ZM41.0873 0.829965L50.3673 3.39997C47.6173 1.58997 44.3673 0.689965 41.0873 0.829965Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center scale-[1.3]">
        <svg ref={innerRef} className="anim-text" width="50" height="50" viewBox="0 0 74 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M46.1171 71.01H28.3171C23.2671 71.01 18.5571 68.78 15.4171 64.88L4.31715 51.16L4.93715 50.66L16.0371 64.38C19.0271 68.09 23.5071 70.21 28.3171 70.21H46.1171C50.9271 70.21 55.4071 68.09 58.3971 64.38L69.4371 50.73L72.6572 38.26C72.6172 38.03 72.5672 37.81 72.5172 37.58L72.4271 37.18L68.5572 20.46C67.4872 15.84 64.3871 12.02 60.0571 9.96L44.0371 2.35C39.7071 0.29 34.7371 0.29 30.3971 2.35L14.3571 9.97C10.0271 12.03 6.92715 15.85 5.85715 20.47L1.89715 37.58C0.827149 42.19 1.92715 46.96 4.92715 50.67L4.30715 51.17C1.16715 47.26 0.00714895 42.24 1.12715 37.39L5.08715 20.28C6.20715 15.43 9.46715 11.4 14.0171 9.24L30.0571 1.62C34.6071 -0.54 39.8271 -0.54 44.3771 1.62L60.3971 9.23C64.9471 11.39 68.2071 15.42 69.3271 20.27L73.1972 37L73.8372 36.85L73.4671 38.29C74.2571 42.86 73.0571 47.5 70.0971 51.16L58.9972 64.88C55.8572 68.77 51.1471 71.01 46.0971 71.01H46.1171Z" fill="currentColor" />
        </svg>
      </div>

      <div className="anim-text absolute inset-0 flex items-center justify-center text-[10px] uppercase font-semibold tracking-wider text-center px-4 leading-tight">
        {text}
      </div>
    </div>
  );
};

interface Project {
  title: string;
  client: string;
  description: string;
  href: string;
  videoSources: { src: string; type: string }[];
  centered?: boolean;
  shortName: string;
}

const projects: Project[] = [
  {
    title: "Rise of the Merlin",
    client: "The Pendragon Cycle",
    description: "An immersive interactive experience for Rise of the Merlin",
    href: "/work/pendragon-rise-of-the-merlin",
    centered: true,
    shortName: "Rise of the Merlin",
    videoSources: [
      { src: "https://videos.merlin.studio/1764068557-pendragon-header_h265.mp4", type: 'video/mp4;codecs="hvc1"' },
      { src: "https://videos.merlin.studio/1764068557-pendragon-header_vp9.webm", type: "video/webm" },
      { src: "https://videos.merlin.studio/1764068557-pendragon-header.mp4", type: "video/mp4" },
    ],
  },
  {
    title: "Dior – Garden of Dreams",
    client: "Dior",
    description: "An immersive world experience using webAR",
    href: "/work/dior-garden-of-dreams",
    shortName: "DIOR",
    videoSources: [
      { src: "https://videos.merlin.studio/1742804226-dior-no-audio_h265.mp4", type: 'video/mp4;codecs="hvc1"' },
      { src: "https://videos.merlin.studio/1742804226-dior-no-audio_vp9.webm", type: "video/webm" },
      { src: "https://videos.merlin.studio/1742804226-dior-no-audio.mp4", type: "video/mp4" },
    ],
  },
  {
    title: "erthos®",
    client: "erthos®",
    description: "Crafting an award-winning web experience for erthos® that's elegant, performant and accessible.",
    href: "/work/erthos",
    shortName: "ERTHOS",
    videoSources: [
      { src: "https://videos.merlin.studio/1720529838-erthos-loop-comp_h265.mp4", type: 'video/mp4;codecs="hvc1"' },
      { src: "https://videos.merlin.studio/1720529838-erthos-loop-comp_vp9.webm", type: "video/webm" },
      { src: "https://videos.merlin.studio/1720529838-erthos-loop-comp.mp4", type: "video/mp4" },
    ],
  },
  {
    title: "Inter Milan x Nike",
    client: "Inter Milan x Nike",
    description: "Partnering with DEPT® to craft an animated one-pager for Inter Milan and Nike",
    href: "/work/interxnike",
    shortName: "INTER MILAN X NIKE",
    videoSources: [
      { src: "https://videos.merlin.studio/1684948863-thumb_nike_h265.mp4", type: 'video/mp4;codecs="hvc1"' },
      { src: "https://videos.merlin.studio/1684948863-thumb_nike_vp9.webm", type: "video/webm" },
      { src: "https://videos.merlin.studio/1684948863-thumb_nike.mp4", type: "video/mp4" },
    ],
  },
  {
    title: "SKKY Partners",
    client: "SKKY Partners",
    description: "Creating an accessible, high-performance and elegant web experience for SKKY Partners",
    href: "/work/skky-partners",
    shortName: "SKKY",
    videoSources: [
      { src: "https://videos.merlin.studio/1690739871-skky-thumb_h265.mp4", type: 'video/mp4;codecs="hvc1"' },
      { src: "https://videos.merlin.studio/1690739871-skky-thumb_vp9.webm", type: "video/webm" },
      { src: "https://videos.merlin.studio/1690739871-skky-thumb.mp4", type: "video/mp4" },
    ],
  },
  {
    title: "Eurovision Village",
    client: "Eurovision Song Contest",
    description: "Helping DEPT® to deliver a groundbreaking virtual experience for the Eurovision Song Contest, crafting an accessible 3D world to host Eurovision",
    href: "/work/eurovision-village",
    shortName: "EUROVISION",
    videoSources: [
      { src: "https://videos.merlin.studio/1687987976-eurovision_01_h265.mp4", type: 'video/mp4;codecs="hvc1"' },
      { src: "https://videos.merlin.studio/1687987976-eurovision_01_vp9.webm", type: "video/webm" },
      { src: "https://videos.merlin.studio/1687987976-eurovision_01.mp4", type: "video/mp4" },
    ],
  },
];

export default function ProjectsSection() {

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray<HTMLElement>(".project-item");

    items.forEach((item) => {

      const fadeEls = item.querySelectorAll(".anim-fade");

      gsap.from(fadeEls, {
        opacity: 0,
        y: 80,
        stagger: 0.12,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });


      ScrollTrigger.create({
        trigger: item,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          const progress = self.progress;
          const fadeEls = item.querySelectorAll(".anim-fade");
          const video = item.querySelector("video");
          gsap.to(item, {
            scale: 1 - progress * 0.05,
            // opacity: 1 - progress * 0.6,
            duration: 0.15,
            ease: "power2.out",
            overwrite: "auto",
          });

          fadeEls.forEach((el) => {
            gsap.to(el, {
              y: -progress * 80,
              opacity: 1 - progress * 1.2,
              duration: 0.15,
              start: "top 70%",
              ease: "power2.out",
              overwrite: "auto",
            });
          });


          // gsap.to(video, {
          //   opacity: 1 - progress * 0.8,
          //   duration: 0.15,
          //   ease: "power2.out", 
          //   overwrite: "auto",
          // });



        },
      });


      const textEls = item.querySelectorAll(".anim-text");
      const borderEls = item.querySelectorAll(".anim-border");
      const animExploer = item.querySelector(".anim-exploer")

      animExploer?.addEventListener("mouseenter", () => {
        gsap.to(item, { backgroundColor: "#FDA51F", duration: 0.5, overwrite: "auto" });
        gsap.to(borderEls, { borderColor: "#111111", duration: 0.5, overwrite: "auto" });
        gsap.to(textEls, { color: "#111111", duration: 0.5, overwrite: "auto" });
      });

      animExploer?.addEventListener("mouseleave", () => {
        gsap.to(item, {
          backgroundColor: "#000000",
          duration: 0.25,
          overwrite: "auto",
        });

        gsap.to(textEls, {
          color: "#ffffff",
          duration: 0.25,
          overwrite: "auto",
        });

        gsap.to(borderEls, {
          borderColor: "#ffffff",
          duration: 0.25,
          overwrite: "auto",
        });
      });
    });
  }, []);

  return (
    <article
      ref={sectionRef}
      className="bg-black bg-noise  bg-noies text-white"
      aria-labelledby="our-work"
    >

      <div className="px-8 md:px-16 pt-20 pb-10 text-gray-200 ">
        <p className="text-xs uppercase mb-4">Our Work</p>
        <h2 id="our-work" className="text-6xl font-medium  uppercase py-8 mb-12">
          Case studies
        </h2>
        <ul className=" mb-6 flex justify-between  text-xs ">
          <li>Project</li>
          <li>Details</li>
          <li>Thumbnail</li>
          <li>2018-2026</li>
        </ul>
        <hr className="w-full  text-[#ad7827] bg-none" />
      </div>

      <ul className="list-none m-0 p-0">
        {projects.map((project, index) => (
          <li
            style={{ zIndex: index + 2 }}
            key={project.title}
            className={`project-item relative bg-black grid h-screen  grid-cols-12 md:flex-row group overflow-hidden py-4 px-8 ${index === projects.length - 1 ? "h-screen" : ""
              }`}          >

            <article className="relative z-10   flex flex-col h-screen gap-20 col-span-6  px-8 md:px-12 py-10 md:py-12  transition-colors duration-500">


              <h3 className="anim-text anim-fade text-4xl sm:text-6xl lg:text-6xl font-serif text-white">
                {project.title}
              </h3>

              <div className="flex flex-col  anim-fade  mt-36 sm:flex-row justify-between items-start w-full gap-8">

                <div className="hidden sm:flex items-start">
                  <SpinningLogo outerSpeed={20 + index * 2} innerSpeed={25 + index * 2} text={project.shortName} />
                </div>


                <div className="flex flex-col  w-full sm:w-2/3">
                  <div className="flex flex-col max-w-[333px] gap-20">
                    <p className="anim-text anim-fade font-bold text-xs tracking-[0.2em] text-white/80 uppercase">
                      CLIENT: {project.client}
                    </p>
                    <p className="anim-text anim-fade text-sm font-medium max-w-[333px] italic leading-relaxed font-serif text-white/90">
                      {project.description}
                    </p>
                    <div className="w-full">
                      <a
                        href='#'
                        className=" anim-exploer anim-fade  group/btn anim-border flex items-center justify-between w-full pb-4 border-b border-white  "
                      >
                        <span className="anim-text  text-[11px] tracking-[0.15em] uppercase font-bold text-white">
                          Explore case study
                        </span>
                        <span className="anim-text text-white  ">
                          <ArrowIcon />
                        </span>
                      </a>
                    </div>
                  </div>



                </div>
              </div>
            </article>


            <div className="relative   aspect-video md:aspect-auto col-span-6  h-screen  pb-12">
              <video
                autoPlay
                playsInline
                muted
                loop
                preload="metadata"
                className={`w-full h-full object-cover transition-transform duration-700  ${project.centered ? "object-center" : "object-cover"}`}
              >
                {project.videoSources.map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
              </video>
              {/* Subtle dark overlay on hover lift */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
