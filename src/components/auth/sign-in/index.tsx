"use client";
import Link from "next/link";
import { useContext, useState, type FormEvent } from "react";
import SocialSignIn from "../SocialSignIn";
import Logo from "@/components/layout/Header/Logo";
import { Toaster } from "react-hot-toast";
import AuthDialogContext from "@/contexts/AuthDialogContext";

interface SignInProps {
  signInOpen?: (open: boolean) => void;
}

const Signin = ({ signInOpen }: SignInProps) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const authDialog = useContext(AuthDialogContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && password) {
      setTimeout(() => {
        signInOpen?.(false);
      }, 1200);
      authDialog?.setIsSuccessDialogOpen(true);
      setTimeout(() => {
        authDialog?.setIsSuccessDialogOpen(false);
      }, 1100);
    } else {
      setError("Please enter your username and password.");
      authDialog?.setIsFailedDialogOpen(true);
      setTimeout(() => {
        authDialog?.setIsFailedDialogOpen(false);
      }, 1100);
    }
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <SocialSignIn />

      <span className="z-1 relative my-8 block text-center">
        <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-border dark:bg-dark_border"></span>
        <span className="text-body-secondary relative z-10 inline-block bg-white px-3 text-base dark:bg-darklight">
          OR
        </span>
        <Toaster />
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            required
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary hover:bg-darkprimary dark:hover:bg-darkprimary! px-5 py-3 text-base text-white transition duration-300 ease-in-out "
          >
            Sign In
            {/* {loading && <Loader />} */}
          </button>
        </div>
      </form>

      <Link
        href="/"
        className="mb-2 inline-block text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary"
      >
        Forget Password?
      </Link>
      <p className="text-body-secondary text-base">
        Need to talk about a project?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Contact us
        </Link>
      </p>
    </>
  );
};

export default Signin;
