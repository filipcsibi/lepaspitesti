"use client";

import clsx from "clsx";
import { useState } from "react";
import { traseu, TraseuButton } from "@/shared/ui/traseu";
import styles from "./ContactPage.module.css";

type Props = { query: string; title: string; loadLabel: string; note: string; address: string };

/**
 * Google Map of the showroom. It is only loaded after the visitor asks for it,
 * so no third-party content (or cookies) is fetched just by opening the page.
 */
export function ShowroomMap({ query, title, loadLabel, note, address }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={clsx(traseu.surface, styles.map)}>
      {loaded ? (
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className={styles.mapPlaceholder}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.pin}>
            <path
              d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <p className={styles.mapAddress}>{address}</p>
          <TraseuButton onClick={() => setLoaded(true)}>{loadLabel}</TraseuButton>
          <p className={styles.mapNote}>{note}</p>
        </div>
      )}
    </div>
  );
}
