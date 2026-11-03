"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

export type SpineData = { w: string; c: string; t?: string; width: number; height: number };

export function Shelf({ title, sub, books }: { title: string; sub: string; books: SpineData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7 });
  return (
    <section className="section" id="plus-consultes" aria-labelledby="shelf-title">
      <div className="section__head">
        <div>
          <h2 className="section__title" id="shelf-title">{title}</h2>
          <p className="section__sub">{sub}</p>
        </div>
        <div className="arrows">
          <button onClick={() => scroll(-1)} aria-label="Précédent"><ArrowLeftIcon width={14} height={14} /></button>
          <button onClick={() => scroll(1)} aria-label="Suivant"><ArrowRightIcon width={14} height={14} /></button>
        </div>
      </div>
      <div className="shelf" ref={ref}>
        {books.map((b) => (
          <Link
            key={b.w}
            href={`/${encodeURIComponent(b.w)}`}
            className="spine"
            style={{ "--c": b.c, "--t": b.t, "--w": `${b.width}px`, "--h": `${b.height}px` } as CSSProperties}
            title={`Synonymes de ${b.w}`}
          >
            <span className="spine__title">{b.w}</span>
            <span className="spine__mark" aria-hidden>S</span>
          </Link>
        ))}
      </div>
      <div className="shelf-floor" />
    </section>
  );
}
