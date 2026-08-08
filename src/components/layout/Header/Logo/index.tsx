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
      ? getImgPath("/images/logo/DevX-white.svg")
      : getImgPath("/images/logo/DevX.svg");

  return (
    <Link
      href="/"
      className="flex min-w-0 shrink-0 items-center transition-transform duration-300 hover:-translate-y-0.5"
    >
      <Image
        src={logoSrc}
        alt="DevX logo"
        width={150}
        height={50}
        quality={100}
        priority
        className="h-10 w-auto max-w-[180px] transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 sm:h-12"
      />
    </Link>
  );
};

export default Logo;
