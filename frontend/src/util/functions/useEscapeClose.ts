/**
 * Function that allow useState function
 * to change their value via escape button
 */

import { useCallback, useEffect } from "react";

// Define the custom hook named useEscapeClose
export function useEscapeClose({
  activeElem,
  setActiveElem,
}: {
  activeElem: boolean; // Indicates whether the element is active and should respond to Escape key
  setActiveElem: (value: boolean) => void; // Function to set the active state of the element
}) {
  // Define a callback function that handles the Escape key press
  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Check if the activeElem is not false (truthy), and set it to false
        activeElem !== false && setActiveElem(false);
      }
    },
    [activeElem, setActiveElem]
  );

  // Attach event listeners when the component using the hook mounts
  useEffect(() => {
    // Add an event listener for the keydown event on the whole document
    document.addEventListener("keydown", escFunction, false);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]); // Re-run the effect if escFunction changes
}

