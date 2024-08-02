import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
      <SiteHeader/>
      <Component {...pageProps} />
      <Footer/>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
