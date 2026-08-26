"use client";

import { useSyncExternalStore } from "react";

function getServerFalse() {
  return false;
}

/** Shared media-query hook (matchMedia via useSyncExternalStore — no setState-in-effect). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    getServerFalse,
  );
}
