"use client";

import { motion } from "framer-motion";

export function SleepingEyes() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Floating Z's */}
      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute font-serif text-foreground/30 select-none"
          style={{
            left: `${15 + Math.random() * 70}%`,
            bottom: "30%",
            fontSize: `${1.5 + Math.random() * 2}rem`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.6, 0.4, 0],
            y: -300 - Math.random() * 200,
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeOut",
          }}
        >
          Z
        </motion.span>
      ))}

      {/* Eyes container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-16 md:gap-24">
          {/* Left Eye */}
          <motion.div
            className="relative"
            animate={{ y: [0, 4, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Eye closed line */}
            <svg
              width="80"
              height="40"
              viewBox="0 0 80 40"
              className="md:w-[120px] md:h-[60px]"
            >
              <motion.path
                d="M 5 30 Q 40 5 75 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-foreground/80"
              />
              {/* Eyelashes */}
              <motion.path
                d="M 15 25 L 10 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
              <motion.path
                d="M 30 18 L 27 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
              <motion.path
                d="M 50 18 L 53 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
              <motion.path
                d="M 65 25 L 70 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
            </svg>
          </motion.div>

          {/* Right Eye */}
          <motion.div
            className="relative"
            animate={{ y: [0, 4, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          >
            <svg
              width="80"
              height="40"
              viewBox="0 0 80 40"
              className="md:w-[120px] md:h-[60px]"
            >
              <motion.path
                d="M 5 30 Q 40 5 75 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-foreground/80"
              />
              {/* Eyelashes */}
              <motion.path
                d="M 15 25 L 10 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
              <motion.path
                d="M 30 18 L 27 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
              <motion.path
                d="M 50 18 L 53 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
              <motion.path
                d="M 65 25 L 70 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground/60"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
