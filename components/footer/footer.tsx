"use client";

import { Box } from "components/box";
import { Logo } from "components/logo/logo";
import { useEffect } from "react";
import { animate } from "motion";
import styles from "./footer.module.css";
import Link from "next/link";
import { Text } from "components/text/text";

interface FooterProps {}

const Footer = (props: FooterProps) => {
  useEffect(() => {
    const logo = document.querySelectorAll("#logo");
    animate(logo, { opacity: [0, 1] }, { delay: 0.2 });
  }, []);
  return (
    <Box as="footer" className={styles.root}>
      <Box as="div" className="py-4 px-4">
        <Logo id="logo" />
        <Text as="span" size="xs">
          <Link href="/cgu">CGU</Link>
        </Text>
      </Box>
    </Box>
  );
};
export { Footer };
export type { FooterProps };
