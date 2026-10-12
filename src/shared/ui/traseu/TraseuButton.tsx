import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import type { NavHref } from "@/config/navigation";
import traseu from "./traseu.module.css";
import styles from "./TraseuButton.module.css";

type CommonProps = {
  children: ReactNode;
  className?: string;
  /** Optional colour of the button's wash and route line, e.g. the section's brand colour. */
  tint?: string;
  /** Colour of the route line, without filling the button. */
  accent?: string;
  size?: "md" | "sm";
};

type InternalLinkProps = CommonProps & { href: NavHref; newTab?: boolean };
type ExternalLinkProps = CommonProps & { externalHref: string; newTab?: boolean };
type ActionProps = CommonProps & {
  onClick: () => void;
  type?: "button" | "submit";
  ariaPressed?: boolean;
};

export type TraseuButtonProps = InternalLinkProps | ExternalLinkProps | ActionProps;

/**
 * The site-wide call-to-action button ("DESCOPERĂ MAI MULT", "CITEȘTE", …).
 * Traseu plate: the route line is traced around its edge on hover.
 */
export function TraseuButton(props: TraseuButtonProps) {
  const { children, className, tint, accent, size = "md" } = props;
  const classes = clsx(traseu.surface, traseu.interactive, styles.button, styles[size], className);
  const style = accent
    ? ({ "--traseu-accent": accent } as CSSProperties)
    : tint
      ? ({ "--traseu-tint": `color-mix(in srgb, ${tint} 42%, transparent)`, "--traseu-accent": tint } as CSSProperties)
      : undefined;
  const label = <span className={styles.label}>{children}</span>;

  if ("href" in props) {
    return (
      <Link
        href={props.href}
        className={classes}
        style={style}
        {...(props.newTab ? { target: "_blank", rel: "noopener" } : {})}
      >
        {label}
      </Link>
    );
  }

  if ("externalHref" in props) {
    return (
      <a
        href={props.externalHref}
        className={classes}
        style={style}
        {...(props.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      aria-pressed={props.ariaPressed}
      className={classes}
      style={style}
    >
      {label}
    </button>
  );
}
