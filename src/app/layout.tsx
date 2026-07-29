import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import Aoscompo from "@/utils/aos";
import NextTopLoader from 'nextjs-toploader';
import { AuthDialogProvider } from "./context/AuthDialogContext";
<<<<<<< HEAD
import IntroAnimation from "@/components/Common/IntroAnimation";
const inter = Inter({ subsets: ["latin"] });
=======
import { SessionProvider } from "./context/SessionContext";
import localFont from "next/font/local";

const rota = localFont({
  src: "./fonts/Rota-Medium.otf",
  variable: "--font-rota",
  display: "swap",
});
>>>>>>> 872113e (Refine navigation and update website content)

export const metadata: Metadata = {
  metadataBase: new URL("https://DevXinnovation.vercel.app"),
  applicationName: "DevX",
  title: {
    default: "DevX | Digital Solutions Agency",
    template: "%s | DevX",
  },
  description:
    "DevX is a premium digital solutions agency building modern websites, SaaS platforms, AI integrations, and scalable software products.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "DevX | Digital Solutions Agency",
    description:
      "Premium digital solutions agency for modern software, SaaS, AI, and cloud delivery.",
    siteName: "DevX",
    images: [
      {
        url: "/images/brand/DevX-preview.png",
        width: 1536,
        height: 1024,
        alt: "DevX logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevX | Digital Solutions Agency",
    description:
      "Premium digital solutions agency for modern software, SaaS, AI, and cloud delivery.",
    images: ["/images/brand/DevX-mark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" className="bg-white dark:bg-darkmode" suppressHydrationWarning>
      <head>
        <script
          id="vertex-intro-state"
          dangerouslySetInnerHTML={{
            __html: `
            try {
              document.documentElement.dataset.vertexIntro =
                window.localStorage.getItem("vertex-intro-seen-v1") === "true"
                  ? "seen"
                  : "show";
            } catch (error) {
              document.documentElement.dataset.vertexIntro = "seen";
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
      <NextTopLoader />
      <AuthDialogProvider>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="system"
          enableColorScheme
          disableTransitionOnChange
        >
          <IntroAnimation />
          <Aoscompo>
            <Header />
            {children}
            <Footer />
          </Aoscompo>
          <ScrollToTop />
        </ThemeProvider>
=======
    <html lang="en" suppressHydrationWarning>
      <body className={`${rota.variable} font-sans`}>
      <NextTopLoader />
      <SessionProvider>
        <AuthDialogProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="system"
          >
            <Aoscompo>
              <Header />
              {children}
              <Footer />
            </Aoscompo>
          </ThemeProvider>
>>>>>>> 872113e (Refine navigation and update website content)
        </AuthDialogProvider>
      </SessionProvider>
      </body>
    </html>
  );
}

