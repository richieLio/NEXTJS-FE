import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "../components/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <UserProvider>
          <SiteHeader />
          <Component {...pageProps} />
          <Footer />
        </UserProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
        />
      </NextThemesProvider>
    </NextUIProvider>
  );
}
