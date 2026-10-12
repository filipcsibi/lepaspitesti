"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { FORM_ID, FormLink } from "./FormLink";
import styles from "./StickyCta.module.css";

type Props = { label: string; price?: string };

/** Phone-only bar pinned to the bottom of the screen while the form is out of view. */
export function StickyCta({ label, price }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById(FORM_ID);
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.05 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={clsx(styles.bar, visible && styles.visible)} aria-hidden={!visible}>
      {price && <span className={styles.price}>{price}</span>}
      <FormLink className={styles.button}>{label}</FormLink>
    </div>
  );
}
