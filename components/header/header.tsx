"use client";

import { Box } from "components/box";
import { Logo } from "components/logo/logo";
import { useEffect, useLayoutEffect } from "react";
import { animate } from "motion";

interface HeaderProps {}

const Header = (props: HeaderProps) => {
  useEffect(() => {
    const logo = document.querySelectorAll("#logo");
    animate(logo, { opacity: [0, 1] }, { delay: 0.2 });
  }, []);
  return (
    <Box as="header" className="max-w-8xl mx-auto">
      <Box as="div" className="py-4 px-4">
        <Logo id="logo" />
      </Box>
    </Box>
  );
};
export { Header };
export type { HeaderProps };
