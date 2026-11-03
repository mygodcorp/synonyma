"use client";

import { useState } from "react";
import { LinkIcon, SpeakerIcon } from "./icons";

export function ArticleTools({ word }: { word: string }) {
  const [copied, setCopied] = useState(false);
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "fr-FR";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="article__tools">
      <button className="icon-btn" onClick={speak} aria-label={`Écouter « ${word} »`} title="Écouter">
        <SpeakerIcon />
      </button>
      <button className="icon-btn" onClick={copy} aria-label="Copier le lien" title={copied ? "Lien copié" : "Copier le lien"}>
        <LinkIcon />
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Lien copié" : ""}</span>
    </div>
  );
}
