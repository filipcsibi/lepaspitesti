import clsx from "clsx";
import { Reveal } from "@/shared/ui/motion";
import styles from "./shared.module.css";

/** Small section heading with the Panther Orange underline ("Design exterior", "Motorizare", …). */
export function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <Reveal as="h2" className={clsx(styles.label, className)}>
      {children}
    </Reveal>
  );
}
