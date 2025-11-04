"use client";

import React, { forwardRef, useEffect, useReducer, useState } from "react";
import useInterval from "@use-it/interval";
import { Box } from "components/box";

const alphanumeric = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const scrambleFN = (string: string) => {
  const array = string.split("");
  const chars = array.map((char) => {
    const range = Math.floor(Math.random() * alphanumeric.length);
    return alphanumeric[range];
  });

  return chars.join("");
};

export const Scramble = forwardRef(
  (
    { content, size = 10 }: { content: string; size: number },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const [text, setText] = useState(content);
    const [start, increment] = useReducer((state) => state + 1, 0);
    const end = start > content.length;

    useInterval(() => increment(), end ? null : 100);

    useInterval(
      () => {
        const finished = content.slice(0, start);
        const animate = scrambleFN(content.slice(start, start + size));
        setText(animate + finished);
      },
      end ? null : 30
    );

    return <Box ref={ref}>{text}</Box>;
  }
);
