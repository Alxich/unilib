import { useRouter } from "next/router";
import { MouseEvent } from "react";

/**
 * That code allow scroll to top of the page if
 * url matches to homepage (not so useful but anyway)
 *
 * use e to targer an element
 * use link with e to allow check the url === link
 */

// Define the custom hook named useScrollToTop
export function useScrollToTop() {
  const router = useRouter(); // Import the useRouter hook from Next.js

  // Define the scrollToTop function, which handles scrolling to the top
  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>, link?: string) => {
    if (link) {
      // Check if the provided link is not falsy
      if (router.pathname === "/" && link === "/") {
        e.preventDefault(); // Prevent the default link behavior (navigation)
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
      }
    } else {
      // If no specific link is provided
      if (router.pathname === "/") {
        e.preventDefault(); // Prevent the default link behavior (navigation)
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
      }
    }
  };

  // Return an object containing the scrollToTop function
  return { scrollToTop };
}
