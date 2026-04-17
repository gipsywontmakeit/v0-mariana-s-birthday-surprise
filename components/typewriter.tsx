"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterProps {
  lines: string[];
  onComplete?: () => void;
  className?: string;
  typingSpeed?: number;
  lineDelay?: number;
}

const MAX_VISIBLE_LINES = 4;

export function Typewriter({
  lines,
  onComplete,
  className = "",
  typingSpeed = 80,
  lineDelay = 1200,
}: TypewriterProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<{ text: string; id: number }[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const cursorControls = useAnimation();

  useEffect(() => {
    cursorControls.start({
      opacity: [1, 1, 0, 0, 1],
      transition: { duration: 1, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] },
    });
  }, [cursorControls]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      const doneTimeout = setTimeout(() => {
        setShowCursor(false);
        onComplete?.();
      }, 1000);
      return () => clearTimeout(doneTimeout);
    }

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;
    const startDelay = currentLineIndex === 0 ? 500 : lineDelay;

    const startTyping = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex <= currentLine.length) {
          setCurrentText(currentLine.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);

          const finishLineTimeout = setTimeout(() => {
            setDisplayedLines((prev) => {
              const updated = [...prev, { text: currentLine, id: currentLineIndex }];
              return updated.slice(-MAX_VISIBLE_LINES);
            });

            setCurrentText("");
            setCurrentLineIndex((prev) => prev + 1);
          }, lineDelay);

          return () => clearTimeout(finishLineTimeout);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    }, startDelay);

    return () => clearTimeout(startTyping);
  }, [currentLineIndex, lines, onComplete, typingSpeed, lineDelay]);

  return (
    <div className={`flex flex-col justify-end min-h-[260px] md:min-h-[300px] ${className}`}>
      <div className="overflow-hidden space-y-6">
        <AnimatePresence mode="popLayout">
          {displayedLines.map((line) => (
            <motion.p
              key={line.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-serif leading-relaxed"
            >
              {line.text}
            </motion.p>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.p
            key={`typing-${currentLineIndex}`}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            className="text-xl md:text-2xl lg:text-3xl text-foreground font-serif leading-relaxed"
          >
            {currentText}
            {showCursor && (
              <motion.span
                animate={cursorControls}
                className="inline-block w-0.5 h-7 md:h-8 bg-primary ml-0.5 align-middle"
              />
            )}
          </motion.p>
        )}

        {!isTyping && showCursor && (
          <motion.span
            animate={cursorControls}
            className="inline-block w-0.5 h-7 md:h-8 bg-primary ml-0.5 align-middle"
          />
        )}
      </div>
    </div>
  );
}