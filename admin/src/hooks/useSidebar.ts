import { useState, useCallback } from "react";

const STORAGE_KEY = "sidebar-collapsed";

function getInitialState(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }
  return false;
}

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(getInitialState);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed, toggle };
}
