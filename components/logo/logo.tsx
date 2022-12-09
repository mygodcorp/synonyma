import { Box } from "components/box";
import { Scramble } from "components/scramble";
import Link from "next/link";

interface LogoProps {
  id?: string;
}

const Logo = (props: LogoProps) => (
  <Box as="div" className="font-bold text-xs" id={props?.id}>
    <Link href="/">
      <Scramble size={20} content="SYNONYMA®" />
    </Link>
  </Box>
);

export { Logo };
export type { LogoProps };
