"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterProps {
  lines: string[];
  onComplete?: () => void;
  className?: string;
}

export function Typewriter({ lines, onComplete, className = "" }: TypewriterProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const cursorControls = useAnimation();

  useEffect(() => {
    cursorControls.start({
      opacity: [1, 0, 1],
      transition: { duration: 0.8, repeat: Infinity },
    });
  }, [cursorControls]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      onComplete?.();
      return;
    }

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentLine.length) {
        setCurrentText(currentLine.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        
        // Pause before next line
        setTimeout(() => {
          setDisplayedLines((prev) => [...prev, currentLine]);
          setCurrentText("");
          setCurrentLineIndex((prev) => prev + 1);
        }, 800);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentLineIndex, lines, onComplete]);

  return (
    <div className={`space-y-4 ${className}`}>
      {displayedLines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl text-foreground/90"
        >
          {line}
        </motion.p>
      ))}
      {isTyping && (
        <p className="text-xl md:text-2xl text-foreground">
          {currentText}
          <motion.span
            animate={cursorControls}
            className="inline-block w-0.5 h-6 bg-primary ml-1 align-middle"
          />
        </p>
      )}
    </div>
  );
}
