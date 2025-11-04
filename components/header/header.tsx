"use client";

import { Box } from "components/box";
import { Logo } from "components/logo/logo";
import { useEffect, useRef } from "react";
import { animate } from "motion";

interface HeaderProps {}

const Header = (props: HeaderProps) => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      animate(logoRef.current, { opacity: [0, 1] }, { delay: 0.2 });
    }
  }, []);

  return (
    <Box as="header" className="max-w-8xl mx-auto">
      <Box as="div" className="py-4 px-4" ref={logoRef}>
        <Logo />
      </Box>
    </Box>
  );
};

export { Header };
export type { HeaderProps };
