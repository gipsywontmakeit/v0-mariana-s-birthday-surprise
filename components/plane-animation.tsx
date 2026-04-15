"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

interface PlaneAnimationProps {
  onComplete: () => void;
}

export function PlaneAnimation({ onComplete }: PlaneAnimationProps) {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      {/* Flight path line */}
      <motion.div
        className="absolute top-1/2 left-0 h-px bg-primary/20"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />
      
      {/* Plane */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        initial={{ left: "-10%" }}
        animate={{ left: "105%" }}
        transition={{ 
          duration: 3, 
          ease: "easeInOut",
        }}
        onAnimationComplete={onComplete}
      >
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Plane className="w-8 h-8 text-primary -rotate-12" />
        </motion.div>
      </motion.div>
      
      {/* Trail dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/30"
          initial={{ left: "-10%", opacity: 0 }}
          animate={{ left: "105%", opacity: [0, 0.5, 0] }}
          transition={{ 
            duration: 3, 
            ease: "easeInOut",
            delay: (i + 1) * 0.15,
          }}
        />
      ))}
    </div>
  );
}
