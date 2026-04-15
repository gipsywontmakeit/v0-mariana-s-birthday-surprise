"use client";

import { motion } from "framer-motion";

interface NarratorProps {
  text: string;
  delay?: number;
}

export function Narrator({ text, delay = 0.5 }: NarratorProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay, duration: 1 }}
      className="absolute top-8 left-0 right-0 text-center text-sm md:text-base text-muted-foreground italic font-serif px-6"
    >
      {text}
    </motion.p>
  );
}
