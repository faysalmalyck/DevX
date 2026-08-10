"use client";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import SocialSignUp from "../SocialSignUp";
import Logo from "@/components/layout/Header/Logo";
import { useContext, useState, type FormEvent } from "react";
import Loader from "@/components/shared/Loader";
import AuthDialogContext from "@/contexts/AuthDialogContext";
interface SignUpProps {
  signUpOpen?: (open: boolean) => void;
}

const SignUp = ({signUpOpen}: SignUpProps) => {
  const [loading, setLoading] = useState(false);
  const authDialog = useContext(AuthDialogContext);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    toast.success("Thanks for signing up — we’ll be in touch soon.");
    setLoading(false);
    setTimeout(() => {
      signUpOpen?.(false);
    }, 1200);
    authDialog?.setIsUserRegistered(true);

    setTimeout(() => {
      authDialog?.setIsUserRegistered(false);
    }, 1100);

  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <SocialSignUp />

      <span className="z-1 relative my-8 block text-center">
        <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-border dark:bg-dark_border"></span>
        <span className="text-body-secondary relative z-10 inline-block bg-white px-3 text-base dark:bg-darklight">
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary px-5 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:bg-darkprimary! dark:hover:bg-darkprimary!"
          >
            Sign Up {loading && <Loader />}
          </button>
        </div>
      </form>

      <p className="text-body-secondary mb-4 text-base">
        By creating an account you are agree with our{" "}
        <a href="#!" className="text-primary hover:underline">
          Privacy
        </a>{" "}
        and{" "}
        <a href="#!" className="text-primary hover:underline">
          Policy
        </a>
      </p>

      <p className="text-body-secondary text-base">
        Already have an account?
        <Link
          href="/"
          className="pl-2 text-primary hover:bg-darkprimary hover:underline"
        >
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
