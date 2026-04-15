"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const evidenceNotes = [
  { text: "Ressona à noite — culpa: a medicação", rotate: -3 },
  { text: "Arrotos suspeitos — culpa: a medicação", rotate: 2 },
  { text: "Dorme até ao meio-dia — culpa: a medicação", rotate: -1 },
];

const conclusion = {
  text: "Conclusão: a medicação tem muita culpa.",
  rotate: 4,
};

interface EvidenceBoardProps {
  onAllRevealed?: () => void;
}

export function EvidenceBoard({ onAllRevealed }: EvidenceBoardProps) {
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [showConclusion, setShowConclusion] = useState(false);

  const handleCardClick = (index: number) => {
    if (revealedCards.includes(index)) return;
    
    const newRevealed = [...revealedCards, index];
    setRevealedCards(newRevealed);
    
    // Check if all cards are revealed
    if (newRevealed.length === evidenceNotes.length) {
      setTimeout(() => {
        setShowConclusion(true);
        setTimeout(() => {
          onAllRevealed?.();
        }, 1500);
      }, 800);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Board background */}
      <div className="relative bg-secondary/50 border border-border rounded-lg p-8 md:p-12 min-h-[400px]">
        {/* Cork texture lines */}
        <div className="absolute inset-0 opacity-10 overflow-hidden rounded-lg">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-foreground/20"
              style={{ top: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Red string connections - only show when cards are revealed */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <AnimatePresence>
            {revealedCards.length >= 2 && (
              <motion.line
                x1="20%"
                y1="25%"
                x2="80%"
                y2="25%"
                stroke="oklch(0.55 0.2 20)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 0.8 }}
              />
            )}
            {revealedCards.length >= 3 && (
              <>
                <motion.line
                  x1="50%"
                  y1="25%"
                  x2="30%"
                  y2="55%"
                  stroke="oklch(0.55 0.2 20)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 0.8 }}
                />
              </>
            )}
            {showConclusion && (
              <motion.line
                x1="30%"
                y1="55%"
                x2="50%"
                y2="80%"
                stroke="oklch(0.55 0.2 20)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>
        </svg>

        {/* Evidence notes */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {evidenceNotes.map((note, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
              style={{ transform: `rotate(${note.rotate}deg)` }}
              onClick={() => handleCardClick(index)}
            >
              {/* Pin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 shadow-md z-10" />
              
              {/* Card */}
              <div className="relative overflow-hidden">
                <motion.div
                  className="bg-amber-100/90 p-4 shadow-lg border-b-4 border-amber-200"
                  animate={{
                    filter: revealedCards.includes(index) ? "blur(0px)" : "blur(0px)",
                  }}
                >
                  {/* Content */}
                  <div className="relative">
                    <p className={`font-serif text-sm md:text-base leading-relaxed transition-colors duration-500 ${
                      revealedCards.includes(index) ? "text-amber-900" : "text-transparent"
                    }`}>
                      {note.text}
                    </p>
                    
                    {/* Redaction bar overlay */}
                    <AnimatePresence>
                      {!revealedCards.includes(index) && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ x: 0 }}
                          exit={{ x: "110%" }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="w-full h-6 bg-foreground/90 rounded-sm" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Click hint for first card only */}
                    {index === 0 && revealedCards.length === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground italic"
                      >
                        clique para revelar
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Conclusion note - spans full width */}
          <AnimatePresence>
            {showConclusion && (
              <motion.div
                className="md:col-span-2 flex justify-center mt-4"
                initial={{ opacity: 0, y: 30, scale: 0.8, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.6, type: "spring", damping: 15 }}
              >
                <div
                  className="relative"
                  style={{ transform: `rotate(${conclusion.rotate}deg)` }}
                >
                  {/* Pin */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 shadow-md z-10" />
                  
                  {/* Note - slightly different color */}
                  <div className="bg-amber-50/95 p-5 shadow-xl border-b-4 border-amber-300">
                    <p className="text-amber-900 font-serif text-base md:text-lg font-medium leading-relaxed">
                      {conclusion.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
