import Image from "next/image";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { getImageDimensions, type Dimensions } from "@/shared/lib/image-dimensions";

const IMAGE_PATTERN = /!\[[^\]]*\]\(([^)\s]+)/g;

/**
 * Renders editor-written Markdown (legal pages).
 * Local images are served through `next/image` with their real dimensions.
 * Links written as `page:/cookies` point to that page in the visitor's language.
 */
export async function Markdown({ children, className }: { children: string; className?: string }) {
  const sources = [...children.matchAll(IMAGE_PATTERN)].map((m) => m[1]).filter((s) => s.startsWith("/"));
  const sizes = new Map<string, Dimensions>(
    await Promise.all(sources.map(async (s) => [s, await getImageDimensions(s)] as const)),
  );

  return (
    <div className={className}>
      <ReactMarkdown
        urlTransform={(url) => (url.startsWith("page:") ? url : defaultUrlTransform(url))}
        components={{
          img: ({ src, alt }) => {
            if (typeof src !== "string") return null;
            const size = sizes.get(src);
            if (!size) {
              // eslint-disable-next-line @next/next/no-img-element
              return <img src={src} alt={alt ?? ""} loading="lazy" />;
            }
            return (
              <Image
                src={src}
                alt={alt ?? ""}
                width={size.width}
                height={size.height}
                sizes="(max-width: 767px) 92vw, 73vw"
                style={{ width: "100%", height: "auto" }}
              />
            );
          },
          a: ({ href, children: text }) => {
            if (href?.startsWith("page:")) {
              return <Link href={href.slice(5) as AppPathname as "/cookies"}>{text}</Link>;
            }
            const external = href?.startsWith("http");
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {text}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
