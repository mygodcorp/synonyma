"use client";

import { Box } from "components/box";
import { Logo } from "components/logo/logo";
import { useEffect, useRef } from "react";
import { animate } from "motion";
import styles from "./footer.module.css";
import Link from "next/link";
import { Text } from "components/text/text";

interface FooterProps {}

const Footer = (props: FooterProps) => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      animate(logoRef.current, { opacity: [0, 1] }, { delay: 0.2 });
    }
  }, []);

  return (
    <Box as="footer" className={styles.root}>
      <Box as="div" className="py-4 px-4" ref={logoRef}>
        <Logo />
        <Text as="span" size="xs">
          <Link href="/cgu">CGU</Link>
        </Text>
      </Box>
    </Box>
  );
};

export { Footer };
export type { FooterProps };
