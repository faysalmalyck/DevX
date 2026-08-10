import HeroSub from "@/components/shared/HeroSub";
import NotFound from "@/components/not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page",
};

const ErrorPage = () => {
  return (
    <>
      <HeroSub
        title="404"
        description="We Can't Seem to Find The Page You're Looking For."
      />
      <NotFound />
    </>
  );
};

export default ErrorPage;
