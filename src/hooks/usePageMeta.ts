import { useEffect } from "react";
import { site } from "@/content/site";

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — ${site.descriptor}`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    }
  }, [title, description]);
}
