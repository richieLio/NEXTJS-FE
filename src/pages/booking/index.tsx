import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { useDisclosure, Link } from "@nextui-org/react";
import { useScroll, useSpring, useTransform } from "framer-motion";




export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });


  

  return (
    <div className="relative flex flex-col justify-center items-center">
      helloooooooooooooooooooooo
    </div>
  );
}
