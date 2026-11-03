"""Stream the kaikki.org French Wiktionary extraction and keep only what Synonyma needs.

Input : JSONL on stdin (kaikki.org-dictionary-Français.jsonl, ~3 GB)
Output: compact JSONL on stdout, one line per (word, part of speech) entry.
        If FORMS_OUT is set, also writes "form<TAB>lemma" lines for inflected
        forms ("mangeons" -> "manger"), used to redirect them to their lemma.
"""
import json
import os
import sys

forms_out = open(os.environ["FORMS_OUT"], "w") if os.environ.get("FORMS_OUT") else None

SKIP_POS_PREFIX = ("Forme", "Erreur", "Symbole", "Lettre")


def clean(s):
    return " ".join((s or "").split())


def syn_list(items):
    out = []
    for it in items or []:
        w = clean(it.get("word"))
        if not w or len(w) > 60:
            continue
        tags = it.get("tags") or []
        raw = it.get("raw_tags") or []
        out.append({
            "w": w,
            "s": clean(it.get("sense")) or None,
            "t": (tags + raw)[:3] or None,
        })
    return out


n = kept = 0
for line in sys.stdin:
    n += 1
    try:
        d = json.loads(line)
    except Exception:
        continue
    if d.get("lang_code") != "fr":
        continue
    pos_title = d.get("pos_title") or ""
    if forms_out and pos_title.startswith("Forme"):
        form = clean(d.get("word"))
        for s in d.get("senses") or []:
            for f in s.get("form_of") or []:
                lemma = clean(f.get("word"))
                if form and lemma and lemma != form:
                    forms_out.write(f"{form}\t{lemma}\n")
    if pos_title.startswith(SKIP_POS_PREFIX):
        continue
    senses = []
    syns = syn_list(d.get("synonyms"))
    ants = syn_list(d.get("antonyms"))
    for s in d.get("senses") or []:
        if "form-of" in (s.get("tags") or []) or s.get("form_of"):
            continue
        glosses = [clean(g) for g in s.get("glosses") or [] if clean(g)]
        if not glosses:
            continue
        ex = None
        for e in s.get("examples") or []:
            t = clean(e.get("text"))
            if t and len(t) < 260:
                ex = t
                break
        tags = (s.get("tags") or []) + (s.get("raw_tags") or [])
        senses.append({"g": glosses[-1], "e": ex, "t": tags[:4] or None})
        syns += syn_list(s.get("synonyms"))
        ants += syn_list(s.get("antonyms"))
    if not senses:
        continue
    ipa = None
    for snd in d.get("sounds") or []:
        if snd.get("ipa"):
            ipa = snd["ipa"]
            break
    gender = None
    tags = d.get("tags") or []
    for g in ("masculine", "feminine"):
        if g in tags:
            gender = (gender + "-" if gender else "") + g
    kept += 1
    sys.stdout.write(json.dumps({
        "w": clean(d.get("word")),
        "p": pos_title,
        "ipa": ipa,
        "gen": gender,
        "et": clean((d.get("etymology_texts") or [None])[0]) or None,
        "senses": senses[:12],
        "syn": syns,
        "ant": ants,
    }, ensure_ascii=False) + "\n")
    if n % 100000 == 0:
        print(f"read={n} kept={kept}", file=sys.stderr, flush=True)

print(f"DONE read={n} kept={kept}", file=sys.stderr)
