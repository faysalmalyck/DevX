import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "next-themes";
import Aoscompo from "@/providers/AOSProvider";
import NextTopLoader from "nextjs-toploader";
import { AuthDialogProvider } from "@/contexts/AuthDialogContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { CartProvider } from "@/contexts/CartContext";
import CartModal from "@/components/cart/CartModal";
import { ToastProvider } from "@/components/ui/Toast";

const rota = localFont({
  src: "./fonts/Rota-Medium.otf",
  variable: "--font-rota",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://DevXinnovation.vercel.app"),
  applicationName: "DevX",
  title: {
    default: "• DevX | Transforming Ideas Into Digital Products",
    template: "%s | DevX",
  },
  description:
    "DevX helps ambitious brands launch faster, scale smarter, and grow through premium websites, SaaS platforms, AI integrations, and custom digital products.",
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
      <body className={`${rota.variable} font-sans`}>
        <NextTopLoader />
        <SessionProvider>
          <AuthDialogProvider>
            <CartProvider>
              <ThemeProvider
                attribute="class"
                enableSystem={true}
                defaultTheme="system"
                enableColorScheme
                disableTransitionOnChange
              >
                <Aoscompo>
                  <Header />
                  {children}
                  <Footer />
                </Aoscompo>
                <CartModal />
                <ToastProvider />
              </ThemeProvider>
            </CartProvider>
          </AuthDialogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
