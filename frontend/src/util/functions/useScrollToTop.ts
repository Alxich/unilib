import { useRouter } from "next/router";
import { MouseEvent } from "react";

/**
 * That code allow scroll to top of the page if
 * url matches to homepage (not so useful but anyway)
 *
 * use e to targer an element
 * use link with e to allow check the url === link
 */

export function useScrollToTop() {
  const router = useRouter();

  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>, link?: string) => {
    if (link) {
      if (router.pathname === "/" && link === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (router.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return { scrollToTop };
}
