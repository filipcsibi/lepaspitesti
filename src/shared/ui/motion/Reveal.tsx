import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Kept so call sites stay unchanged; text is no longer animated in. */
  delay?: number;
  y?: number;
};

/**
 * Wrapper for section texts. On this site text is simply there when it scrolls into view —
 * no fade or lift; only figures (see `SpecValue`) animate.
 */
export function Reveal({ children, as: Tag = "div", className }: Props) {
  return <Tag className={className}>{children}</Tag>;
}
