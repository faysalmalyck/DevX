"use client";

import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Logo: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "light"
      ? getImgPath("/images/logo/logo.svg") // Logo for light theme
      : getImgPath("/images/logo/logo-white.svg"); // Logo for dark theme

  return (
<<<<<<< HEAD
    <Link
      href="/"
      className="flex min-w-0 shrink-0 items-center transition-transform duration-300 hover:-translate-y-0.5"
    >
      <Image
        src={logoSrc}
        alt="Vertex logo"
        width={90}
        height={20}
        quality={100}
        priority
        className="h-7 w-auto max-w-[132px] transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 sm:h-9"
      />
    </Link>
=======
    <Link href="/" className="inline-block">
              <Image
                src="https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/6217d43b9c76b230bf4fd529_logo-dev-template.svg"
                alt="Dev X "
                width={240}
                height={80}
                className="h-12 w-auto"
              />
            </Link>
>>>>>>> 872113e (Refine navigation and update website content)
  );
};

export default Logo;
