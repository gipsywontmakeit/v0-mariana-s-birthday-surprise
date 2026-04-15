"use client";

import { motion } from "framer-motion";

export function SnoringAnimation() {
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary/60 rounded-full"
          animate={{
            height: [8, 32, 16, 40, 8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
      <span className="ml-3 text-muted-foreground font-serif italic text-lg tracking-wide">
        zzz...
      </span>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`right-${i}`}
          className="w-1 bg-primary/60 rounded-full"
          animate={{
            height: [8, 40, 16, 32, 8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.15 + 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
