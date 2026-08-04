import HeroSub from "@/components/shared/HeroSub";
import NotFound from "@/components/not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page",
};

const ErrorPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "404" },
  ];
  return (
    <>
      <HeroSub
        title="404"
        description="We Can't Seem to Find The Page You're Looking For."
        breadcrumbLinks={breadcrumbLinks}
      />
      <NotFound />
    </>
  );
};

export default ErrorPage;
