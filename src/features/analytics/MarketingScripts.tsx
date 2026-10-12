"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useCookieConsent } from "@/features/cookie-consent";
import { trackingIds } from "./track";

/**
 * Loads Meta Pixel and Google (Analytics / Ads) only for configured IDs and only
 * after the visitor has consented to the matching cookie category.
 */
export function MarketingScripts() {
  const consent = useCookieConsent();
  const pathname = usePathname();
  const meta = consent?.marketing ? trackingIds.metaPixel : undefined;
  const googleIds = [
    consent?.analytics ? trackingIds.ga : undefined,
    consent?.marketing ? trackingIds.googleAds : undefined,
  ].filter((id): id is string => !!id);

  // Client-side navigations don't reload the page — report them as page views.
  useEffect(() => {
    if (meta) window.fbq?.("track", "PageView");
  }, [pathname, meta]);

  return (
    <>
      {meta && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(meta)});`}
        </Script>
      )}
      {googleIds.length > 0 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleIds[0]}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${googleIds
              .map((id) => `gtag('config',${JSON.stringify(id)});`)
              .join("")}`}
          </Script>
        </>
      )}
    </>
  );
}
