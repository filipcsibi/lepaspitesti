"use client";

import type { MouseEvent, ReactNode } from "react";
import { useLenis } from "@/shared/providers/SmoothScrollProvider";

export const FORM_ID = "formular";

type Props = { children: ReactNode; className?: string };

/** Every call-to-action on the landing page leads to the same place: the form. */
export function FormLink({ children, className }: Props) {
  const lenis = useLenis();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const form = document.getElementById(FORM_ID);
    if (!form) return;
    event.preventDefault();
    if (lenis) lenis.scrollTo(form, { offset: -90 });
    else form.scrollIntoView({ behavior: "smooth", block: "start" });
    // On desktop, put the cursor in the first field (on phones this would pop the keyboard mid-scroll).
    if (window.matchMedia("(pointer: fine)").matches) {
      form.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
    }
  };

  return (
    <a href={`#${FORM_ID}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
