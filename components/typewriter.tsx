"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterProps {
  lines: string[];
  onComplete?: () => void;
  className?: string;
  typingSpeed?: number;
  lineDelay?: number;
}

export function Typewriter({ 
  lines, 
  onComplete, 
  className = "",
  typingSpeed = 80,
  lineDelay = 1200,
}: TypewriterProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const cursorControls = useAnimation();

  // Blinking cursor animation
  useEffect(() => {
    cursorControls.start({
      opacity: [1, 1, 0, 0, 1],
      transition: { duration: 1, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] },
    });
  }, [cursorControls]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      // Keep cursor blinking for a moment after completion
      setTimeout(() => {
        setShowCursor(false);
        onComplete?.();
      }, 1000);
      return;
    }

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;

    // Pause before starting each new line (except the first)
    const startDelay = currentLineIndex === 0 ? 500 : lineDelay;

    const startTyping = setTimeout(() => {
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
          }, lineDelay);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    }, startDelay);

    return () => clearTimeout(startTyping);
  }, [currentLineIndex, lines, onComplete, typingSpeed, lineDelay]);

  return (
    <div className={`space-y-6 ${className}`}>
      {displayedLines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-serif leading-relaxed"
        >
          {line}
        </motion.p>
      ))}
      {isTyping && (
        <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-serif leading-relaxed">
          {currentText}
          {showCursor && (
            <motion.span
              animate={cursorControls}
              className="inline-block w-0.5 h-7 md:h-8 bg-primary ml-0.5 align-middle"
            />
          )}
        </p>
      )}
      {!isTyping && showCursor && (
        <motion.span
          animate={cursorControls}
          className="inline-block w-0.5 h-7 md:h-8 bg-primary ml-0.5 align-middle"
        />
      )}
    </div>
  );
}
