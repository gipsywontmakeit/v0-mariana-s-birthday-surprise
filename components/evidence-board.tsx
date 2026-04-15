"use client";

import { motion } from "framer-motion";

const evidenceNotes = [
  { text: "Ressona à noite — culpa: a medicação", rotate: -3 },
  { text: "Arrotos suspeitos — culpa: a medicação", rotate: 2 },
  { text: "Dorme até ao meio-dia — culpa: a medicação", rotate: -1 },
];

const conclusion = {
  text: "Conclusão: a medicação tem muita culpa.",
  rotate: 4,
};

export function EvidenceBoard() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Board background */}
      <div className="relative bg-secondary/50 border border-border rounded-lg p-8 md:p-12 min-h-[400px]">
        {/* Cork texture lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-foreground/20"
              style={{ top: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Red string connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.line
            x1="20%"
            y1="25%"
            x2="50%"
            y2="50%"
            stroke="oklch(0.55 0.2 20)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: 2, duration: 0.8 }}
          />
          <motion.line
            x1="80%"
            y1="25%"
            x2="50%"
            y2="50%"
            stroke="oklch(0.55 0.2 20)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: 2.3, duration: 0.8 }}
          />
          <motion.line
            x1="30%"
            y1="65%"
            x2="50%"
            y2="50%"
            stroke="oklch(0.55 0.2 20)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: 2.6, duration: 0.8 }}
          />
        </svg>

        {/* Evidence notes */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {evidenceNotes.map((note, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.4, duration: 0.5 }}
              style={{ transform: `rotate(${note.rotate}deg)` }}
            >
              {/* Pin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 shadow-md z-10" />
              
              {/* Note */}
              <div className="bg-amber-100/90 p-4 shadow-lg border-b-4 border-amber-200">
                <p className="text-amber-900 font-serif text-sm md:text-base leading-relaxed">
                  {note.text}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Conclusion note - spans full width */}
          <motion.div
            className="md:col-span-2 flex justify-center mt-4"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
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
        </div>
      </div>
    </div>
  );
}
