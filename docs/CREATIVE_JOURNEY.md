# Creative Journey demo — how it works

Live route: **`/creative-journey`**

This page ports a CodePen-style experience into Next.js: **audio gate → counter preloader → GSAP + Lenis + ScrollTrigger**, then scroll-linked SVG and UI.

## File map

| File | Role |
|------|------|
| `app/creative-journey/page.tsx` | Renders the client experience |
| `app/creative-journey/layout.tsx` | Imports route-scoped CSS |
| `app/creative-journey/creative-journey.css` | Layout, z-index stack, typography (scoped class names with `cj-` prefix) |
| `components/creative-journey/CreativeJourneyExperience.tsx` | All interaction: phases, audio, Lenis, GSAP, scroll logic |
| `components/creative-journey/circleTransitions.ts` | Data for SVG circles (initial → final `cx`, `cy`, `r`) |

## Phases (React state)

1. **`gate`** — Full-screen “ENTER EXPERIENCE WITH AUDIO” + **START**. Browsers block audio until a user gesture; this screen is that gesture.
2. **`loading`** — Preloader + counter `[000]`→`[100]` on an interval; click sound + preloader loop; body gets `cj-loading-active` (no scroll).
3. **`live`** — Counter finished; **Lenis** + **ScrollTrigger** init; gradient and preloader animate out; SVG overlay + center glow mount; scroll sounds and parallax run.

## Lenis + GSAP ticker

```text
Lenis smooths scroll → each frame: lenis.raf(time)
GSAP ticker drives raf so ScrollTrigger stays in sync:
  gsap.ticker.add((time) => lenis.raf(time * 1000))
```

On each Lenis `scroll` event we call **`ScrollTrigger.update()`**, then section scroll sounds, then **`requestAnimationFrame`** for the heavy DOM/SVG updates (glow, grid opacity, circle morph, debug text).

**Why `lenis.animatedScroll` instead of `window.scrollY`?** With smooth scrolling, the visual scroll position is Lenis’s animated value; `window.scrollY` can lag or jump.

## ScrollTrigger usage here

- **Section backgrounds** — `gsap.to(section, { backgroundPositionY: "50%", scrollTrigger: { scrub: 1, ... } })` for parallax-style movement.
- **Gradient / preloader** — one-off tweens when `live` starts (not scroll-linked).

## What we changed vs your pasted script

- **`eval(\`scrollSound${currentSection}\`)`** → array index: `scrollSounds[idx]` (safe, typed).
- **Vanilla DOM** → React `useRef` for audio and debug nodes; SVG grid/circles rendered in JSX; **`useId()`** for a unique `clipPath` id (avoids duplicate IDs in React strict mode).
- **`document.createElementNS` grid** → generated with `.map()` in JSX.
- **Cleanup** — `useEffect` return removes Lenis listener, GSAP ticker callback, kills all `ScrollTrigger` instances, stops audio (avoids leaks when navigating away).

## Ideas to extend

- Move scroll-driven math into **`gsap.quickSetter`** or a single **`ScrollTrigger.create({ onUpdate })`** instead of manual `rAF` + attribute writes.
- Use **`gsap.context()`** or **`useGSAP`** from `@gsap/react` for even tighter scoping (this demo uses raw `useEffect` to mirror the original structure).
- Respect **`prefers-reduced-motion`**: skip Lenis smoothing, mute glitch loops, shorten preloader.
