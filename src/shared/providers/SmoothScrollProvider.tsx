"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { gsap, ScrollTrigger } from "@/shared/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** Access the smooth-scroll instance (null during SSR / reduced motion). */
export function useLenis() {
  return useContext(LenisContext);
}

/** Lenis smooth scrolling, synced with GSAP ScrollTrigger (as on the original site). */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ autoRaf: false });
    const tick = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- publish the instance to consumers
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Start every page at the top.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    ScrollTrigger.refresh();
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
