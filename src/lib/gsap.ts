import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/*
 * GSAP is reserved for the few timeline/scroll-driven sequences
 * (showreel scale, process line, playground drawing & morphing).
 * Everyday UI motion uses Motion for React. The two never animate
 * the same element.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
