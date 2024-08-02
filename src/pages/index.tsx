import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import React, { useRef } from "react";

export default function Home() {
  return (
    <div className="relative flex flex-col justify-center items-center">
      <section className="unique-section max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center space-y-5 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl font-light tracking-tighter mx-auto md:text-6xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text">
            Welcome to our{" "}
            <span className="bg-gradient-to-t from-light to-foreground text-transparent bg-clip-text">
              Sport Booking Service
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/80">
            We provide easy and convenient online booking for various sports
          </p>
          <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button color="primary" variant="solid" href="/booking">
                Book Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="w-full h-full absolute -top-32 flex justify-end items-center -z-10"
      >
        <div className="w-3/4 flex justify-center items-center">
          <div className="w-12 h-[600px] bg-light blur-[100px] rounded-3xl max-sm:rotate-[15deg] sm:rotate-[35deg]"></div>
        </div>
      </motion.div>
    
    </div>
  );
}
