"use client";

import { motion } from "framer-motion";

export function ClockAnimation() {
  return (
    <div className="relative w-24 h-24">
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/40" />
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-2 bg-primary/30 left-1/2 -translate-x-1/2"
          style={{
            transform: `rotate(${i * 30}deg) translateY(4px)`,
            transformOrigin: "center 48px",
          }}
        />
      ))}
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full" />
      
      {/* Hour hand - spinning fast to show time passing */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-primary origin-bottom -translate-x-1/2"
        style={{ translateY: "-100%" }}
        animate={{ rotate: [0, 720] }}
        transition={{ duration: 2, ease: "linear" }}
      />
      
      {/* Minute hand - spinning faster */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-primary/70 origin-bottom -translate-x-1/2"
        style={{ translateY: "-100%" }}
        animate={{ rotate: [0, 1440] }}
        transition={{ duration: 2, ease: "linear" }}
      />
      
      {/* +2h text */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-primary font-serif text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        +2 horas
      </motion.div>
    </div>
  );
}
