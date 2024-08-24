import Gird from "@/components/Gird";
import Hero from "@/components/Hero";
import React, { useRef } from "react";

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <Hero />
        <Gird />
      </div>
    </main>
  );
}
