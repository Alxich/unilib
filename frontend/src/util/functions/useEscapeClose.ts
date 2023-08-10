/**
 * Function that allow useState function
 * to change their value via escape button
 */

import { useCallback, useEffect } from "react";

export function useEscapeClose({
  activeElem,
  setActiveElem,
}: {
  activeElem: boolean;
  setActiveElem: (value: boolean) => void;
}) {
  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        activeElem !== false && setActiveElem(false);
      }
    },
    [activeElem, setActiveElem]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);
}
