"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PageAnimations() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    intro
      .from("[data-animate-nav]", { autoAlpha: 0, y: -16, duration: 0.6 })
      .from(
        "[data-animate-hero] > *",
        { autoAlpha: 0, y: 28, duration: 0.75, stagger: 0.09 },
        "-=0.3",
      );

    gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]").forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 44,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          once: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-scroll-stagger]").forEach((container) => {
      const items = container.querySelectorAll("[data-scroll-item]");

      if (!items.length) {
        return;
      }

      gsap.from(items, {
        autoAlpha: 0,
        y: 34,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 82%",
          once: true,
        },
      });
    });
  });

  return null;
}
