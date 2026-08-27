import Image from "next/image";

import { getImgPath } from "@/utils/image";

type AdminBrandLogoProps = {
  surface?: "light" | "dark";
  className?: string;
  alt?: string;
};

/**
 * The same DevX lockup displayed in the public-site header, without a link
 * wrapper. `surface` refers to the background behind the logo: DevX.svg is
 * light artwork for a dark surface, despite its filename.
 */
export default function AdminBrandLogo({
  surface = "dark",
  className = "",
  alt = "DevX logo",
}: AdminBrandLogoProps) {
  const logoSrc = getImgPath(
    surface === "light"
      ? "/images/logo/DevX-white.svg"
      : "/images/logo/DevX.svg",
  );

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={117}
      height={45}
      className={className}
    />
  );
}
