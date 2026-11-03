"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpIcon, SearchIcon } from "./icons";

type Hit = { w: string; s: number; a: number };

export function SearchBox({
  variant = "bar",
  placeholder = "Rechercher un mot",
  autoFocus = false,
}: {
  variant?: "bar" | "hero" | "missing";
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loaded, setLoaded] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setHits([]);
      setLoaded(false);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { results: Hit[] };
        setHits(data.results);
        setActive(data.results.length ? 0 : -1);
        setLoaded(true);
      } catch {
        /* aborted or offline: keep previous hits */
      }
    }, 90);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
      if (variant === "bar" && e.key === "/" && !typing) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [variant]);

  const go = (word: string) => {
    setOpen(false);
    setQ("");
    input.current?.blur();
    router.push(`/${encodeURIComponent(word)}`);
  };

  const submit = () => {
    const pick = active >= 0 ? hits[active] : undefined;
    if (pick) go(pick.w);
    else if (q.trim()) go(q.trim());
  };

  const showList = open && q.trim().length > 0 && loaded;

  return (
    <div ref={box} className={`search search--${variant}`}>
      <form
        role="search"
        className="search__field"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <SearchIcon />
        <label className="sr-only" htmlFor={`${listId}-input`}>
          Rechercher un mot
        </label>
        <input
          ref={input}
          id={`${listId}-input`}
          value={q}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, hits.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {variant !== "bar" && (
          <button type="submit" className="search__go" aria-label="Rechercher">
            <ArrowUpIcon width={16} height={16} style={{ transform: variant === "missing" ? "rotate(90deg)" : undefined }} />
          </button>
        )}
      </form>
      {showList && (
        <ul className="search__list" id={listId} role="listbox">
          {hits.length === 0 && <li className="search__empty">Aucun mot ne commence par « {q.trim()} »</li>}
          {hits.map((h, i) => (
            <li
              key={h.w}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className="search__opt"
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                go(h.w);
              }}
            >
              <span>{h.w}</span>
              <span>
                {h.s} synonyme{h.s > 1 ? "s" : ""}
                {h.a ? ` · ${h.a} antonyme${h.a > 1 ? "s" : ""}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
