"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

/** Runs before paint (inlined in <head>) so the page never flashes the wrong theme. */
export const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };
  return (
    <button className="icon-btn" onClick={toggle} aria-label={dark ? "Thème clair" : "Thème sombre"} title="Changer de thème">
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
