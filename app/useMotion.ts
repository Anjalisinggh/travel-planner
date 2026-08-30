"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power3.out";

function hideCurtain(curtain: Element | null) {
  curtain?.classList.add("curtain-done");
}

export type MotionControls = {
  scrollTo: (target: string) => void;
  setScrollLocked: (locked: boolean) => void;
  restoreScroll: (position: number) => void;
};

/**
 * Wires up the whole showreel motion layer: smooth scroll, the load curtain,
 * split-text headlines, scroll reveals, parallax, the horizontal gallery and
 * the number counters. Everything is scoped to `root` and reverted on unmount.
 */
export function useMotion(root: React.RefObject<HTMLElement | null>): MotionControls {
  const lenisRef = useRef<Lenis | null>(null);

  const setScrollLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, []);

  const restoreScroll = useCallback((position: number) => {
    window.scrollTo(0, position);
    lenisRef.current?.scrollTo(position, { immediate: true });
  }, []);

  const scrollTo = useCallback((target: string) => {
    const node = document.getElementById(target);
    if (!node) return;
    if (lenisRef.current) lenisRef.current.scrollTo(node, { offset: -70 });
    else node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;

    // Failsafe: the curtain is server-rendered and normally removed by the intro
    // timeline. If anything in the motion layer throws, never leave it covering
    // the page.
    const curtainFailsafe = window.setTimeout(() => {
      hideCurtain(document.querySelector(".curtain"));
    }, 4000);

    if (!el) return () => window.clearTimeout(curtainFailsafe);

    if (reduced) {
      // Nothing animates; just make sure nothing is left invisible.
      gsap.set(el.querySelectorAll("[data-reveal], [data-stagger] > *"), { clearProps: "all", opacity: 1 });
      hideCurtain(document.querySelector(".curtain"));
      window.clearTimeout(curtainFailsafe);
      return;
    }

    /* ---------- smooth scroll ---------- */
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      prevent: (node) => node instanceof HTMLElement && Boolean(
        node.closest(".planner-sheet, .chat-panel, .chat-body, .mobile-menu"),
      ),
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ---------- 1. load curtain ---------- */
      const curtain = document.querySelector(".curtain");
      const intro = gsap.timeline();

      if (curtain) {
        intro
          .to(".curtain-bar i", { scaleX: 1, duration: 1.1, ease: "power2.inOut" })
          .to(".curtain-inner", { y: -30, opacity: 0, duration: .5, ease: "power2.in" }, "-=.15")
          .to(curtain, {
            yPercent: -100,
            duration: 1,
            ease: "expo.inOut",
            onComplete: () => hideCurtain(curtain),
          }, "-=.1");
      }

      /* ---------- 2. hero headline ---------- */
      intro.from(".hero h1", {
        yPercent: 28,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      }, "-=.55");

      intro.from(".hero-eyebrow, .hero-copy, .scroll-cue, .hero-rail", {
        y: 26, opacity: 0, duration: .8, ease: EASE, stagger: .07,
      }, "-=.7");

      /* the plate wipes down from the top edge it bleeds off */
      intro.from(".hero-frame", {
        clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "expo.out",
      }, "-=1.2");
      intro.from(".hero-ghost", { opacity: 0, scale: 1.15, duration: 1.4, ease: "expo.out" }, "-=1.1");
      intro.from(".hero-prompt", { yPercent: 60, opacity: 0, duration: .9, ease: "expo.out" }, "-=.75");
      intro.from(".topbar > *", { y: -20, opacity: 0, duration: .6, stagger: .08, ease: EASE }, "-=.7");

      /* ---------- 3. hero parallax on scroll ---------- */
      gsap.to(".hero-frame img", {
        yPercent: 14, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-body", {
        yPercent: -14, opacity: .2, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-ghost", {
        yPercent: -30, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      /* ---------- 4. section headings ---------- */
      el.querySelectorAll<HTMLElement>("[data-split]").forEach((node) => {
        gsap.from(node, {
          y: 48,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: node, start: "top 88%" },
        });
      });

      /* ---------- 5. generic reveals + staggered children ---------- */
      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.from(node, {
          y: 42, opacity: 0, duration: .95, ease: EASE,
          scrollTrigger: { trigger: node, start: "top 90%" },
        });
      });

      el.querySelectorAll<HTMLElement>("[data-stagger]").forEach((node) => {
        gsap.from(Array.from(node.children), {
          y: 48, opacity: 0, duration: .9, ease: EASE, stagger: .09,
          scrollTrigger: { trigger: node, start: "top 86%" },
        });
      });

      /* ---------- 6. image mask reveals ---------- */
      el.querySelectorAll<HTMLElement>("[data-mask]").forEach((node) => {
        gsap.from(node, {
          clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.out",
          scrollTrigger: { trigger: node, start: "top 88%" },
        });
      });

      /* ---------- 7. horizontal gallery ----------
         Desktop only: below 760px the rail is a native swipe strip, so pinning
         it would fight the user's own horizontal scrolling. */
      mm.add("(min-width: 761px)", () => {
        const track = el.querySelector<HTMLElement>(".gallery-track");
        const viewport = el.querySelector<HTMLElement>(".gallery-viewport");
        if (!track || !viewport) return;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".gallery",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });

      /* ---------- 8. marquee loop ---------- */
      const marquee = el.querySelector<HTMLElement>(".marquee-track");
      if (marquee) {
        gsap.to(".marquee-track", {
          xPercent: -100, ease: "none", duration: 26, repeat: -1,
        });
      }

      /* ---------- 9. number counters ---------- */
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 92%" },
          onUpdate: () => {
            const output = node.querySelector<HTMLElement>(".count-output");
            (output ?? node).textContent = String(Math.round(obj.v));
          },
        });
      });

      /* ---------- 10. footer CTA blobs drift ---------- */
      gsap.to(".footer-cta", {
        backgroundPosition: "40% 60%", ease: "none",
        scrollTrigger: { trigger: ".footer-cta", start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);

    /* ---------- 11. magnetic buttons + cursor follower (outside ctx, uses listeners) ---------- */
    const cursor = document.querySelector<HTMLElement>(".cursor-dot");
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    if (fine && cursor) {
      const xTo = gsap.quickTo(cursor, "x", { duration: .5, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: .5, ease: "power3" });
      const move = (e: PointerEvent) => {
        gsap.to(cursor, { opacity: 1, duration: .3, overwrite: "auto" });
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const leave = () => gsap.to(cursor, { opacity: 0, duration: .3 });
      window.addEventListener("pointermove", move);
      document.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", leave);
      });

      el.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((node) => {
        const enter = () => {
          gsap.to(cursor, { scale: 2.1, opacity: .45, duration: .35 });
        };
        const exit = () => {
          gsap.to(node, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.4)" });
          gsap.to(cursor, { scale: 1, opacity: 1, duration: .35 });
        };
        const pull = (e: PointerEvent) => {
          const r = node.getBoundingClientRect();
          gsap.to(node, {
            x: (e.clientX - (r.left + r.width / 2)) * .28,
            y: (e.clientY - (r.top + r.height / 2)) * .34,
            duration: .5, ease: "power3.out",
          });
        };
        node.addEventListener("pointerenter", enter);
        node.addEventListener("pointermove", pull);
        node.addEventListener("pointerleave", exit);
        cleanups.push(() => {
          node.removeEventListener("pointerenter", enter);
          node.removeEventListener("pointermove", pull);
          node.removeEventListener("pointerleave", exit);
        });
      });
    }

    // Images finish loading after ScrollTrigger measured the page.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    cleanups.push(() => window.removeEventListener("load", refresh));

    return () => {
      window.clearTimeout(curtainFailsafe);
      cleanups.forEach((fn) => fn());
      mm.revert();
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  // Motion is wired once against the initial DOM; content updates reuse it.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scrollTo, setScrollLocked, restoreScroll };
}
