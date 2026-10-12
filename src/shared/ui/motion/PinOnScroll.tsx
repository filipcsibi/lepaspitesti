"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/shared/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Extra scroll distance (px) the section stays pinned for. */
  distance?: number;
  /** Where pinning starts, ScrollTrigger syntax. */
  start?: string;
  /** Skip pinning on phones. */
  desktopOnly?: boolean;
};

/** Holds a section in place for a short scroll distance — a "breathing" pause between sections. */
export function PinOnScroll({ children, className, distance = 300, start = "center center", desktopOnly }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(desktopOnly ? "(min-width: 768px)" : "all", () => {
        ScrollTrigger.create({ trigger: ref.current, pin: true, start, end: `+=${distance}` });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
