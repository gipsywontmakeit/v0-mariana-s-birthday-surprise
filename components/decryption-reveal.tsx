"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DecryptionRevealProps {
  targetText: string;
  onComplete?: () => void;
  className?: string;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

export function DecryptionReveal({ targetText, onComplete, className = "" }: DecryptionRevealProps) {
  const [displayText, setDisplayText] = useState(
    targetText.split("").map(() => characters[Math.floor(Math.random() * characters.length)]).join("")
  );
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();
    const targetLength = targetText.length;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Number of characters that should be revealed
      const revealedCount = Math.floor(progress * targetLength);
      
      let newText = "";
      for (let i = 0; i < targetLength; i++) {
        if (i < revealedCount) {
          newText += targetText[i];
        } else {
          newText += characters[Math.floor(Math.random() * characters.length)];
        }
      }
      
      setDisplayText(newText);
      
      if (progress >= 1) {
        clearInterval(interval);
        setDisplayText(targetText);
        setIsComplete(true);
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [targetText, onComplete]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span
        className={`font-mono tracking-wider transition-all duration-300 ${
          isComplete ? "text-primary" : "text-foreground/70"
        }`}
      >
        {displayText}
      </span>
    </motion.div>
  );
}
