import { useRef, useEffect, useCallback } from "react";

export function useDebounce(callback, wait) {
  const timeout = useRef();

  useEffect(() => cleanup(timeout.current), []);

  return useCallback(
    (...args) => {
      const later = () => {
        cleanup(timeout.current);
        callback(...args);
      };

      cleanup(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [callback, wait]
  );
}

function cleanup(timeout) {
  if (timeout) {
    clearTimeout(timeout);
  }
}
