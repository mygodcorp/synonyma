import { Box } from "components/box";
import { Scramble } from "components/scramble";
import Link from "next/link";

const Logo = () => (
  <Box as="div" className="font-bold text-xs">
    <Link href="/">
      <Scramble size={20} content="SYNONYMA®" />
    </Link>
  </Box>
);

export { Logo };
