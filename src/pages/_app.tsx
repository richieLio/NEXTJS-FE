import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "../components/UserContext";
import PartnerSidebar from "@/components/PartnerSideBar";
import React, { useContext } from "react";
import { UserContext } from "@/components/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <UserProvider>
          <div className="flex flex-col min-h-screen">
            <UserContext.Consumer>
              {context => {
                const user = context?.user;
                console.log(user);
                return (
                  <>
                    {user?.role !== 'PARTNER' && (
                      <>
                        <SiteHeader />
                        <main className="flex-1">
                          <Component {...pageProps} />
                        </main>
                      </>
                    )}
                    {user?.role === 'PARTNER' && (
                      <div className="flex flex-row flex-1">
                        <PartnerSidebar />
                        <main className="flex-1">
                          <Component {...pageProps} />
                        </main>
                      </div>
                    )}
                  </>
                );
              }}
            </UserContext.Consumer>
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
          </div>
        </UserProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}