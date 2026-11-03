"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string; sub?: boolean };

/** Table of contents with scroll-spy (highlights the section currently in view). */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = els[0]?.id;
      for (const el of els) if (el.offsetTop <= y) current = el.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);
  return (
    <nav className="toc" aria-label="Sommaire">
      <p className="toc__title">Sommaire</p>
      <ol>
        {items.map((i) => (
          <li key={i.id} className={i.sub ? "toc__sub" : undefined}>
            <a href={`#${i.id}`} data-active={active === i.id}>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
