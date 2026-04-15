"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const evidenceNotes = [
  {
    text: "Ressona à noite — culpa: a medicação",
    position: { top: "12%", left: "8%" },
    rotate: -4,
  },
  {
    text: "Arrotos suspeitos — culpa: a medicação",
    position: { top: "10%", right: "10%" },
    rotate: 3,
  },
  {
    text: "Dorme até ao meio-dia — culpa: a medicação",
    position: { top: "45%", left: "50%", transform: "translateX(-50%)" },
    rotate: -1,
  },
];

// SVG line connections between notes (from index to index)
const stringConnections = [
  { from: 0, to: 2 },
  { from: 1, to: 2 },
];

interface EvidenceBoardProps {
  onAllRevealed?: () => void;
}

export function EvidenceBoard({ onAllRevealed }: EvidenceBoardProps) {
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [showStrings, setShowStrings] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [dimmed, setDimmed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCardClick = (index: number) => {
    if (revealedCards.includes(index)) return;

    // Spotlight effect
    setDimmed(true);
    setTimeout(() => setDimmed(false), 300);

    const newRevealed = [...revealedCards, index];
    setRevealedCards(newRevealed);

    // After all cards revealed, show strings then conclusion
    if (newRevealed.length === evidenceNotes.length) {
      setTimeout(() => {
        setShowStrings(true);
        setTimeout(() => {
          setShowConclusion(true);
          setTimeout(() => {
            onAllRevealed?.();
          }, 1500);
        }, 1200);
      }, 600);
    }
  };

  // Calculate note positions for string drawing
  const getNoteCenter = (index: number) => {
    const note = evidenceNotes[index];
    // Approximate centers based on position
    if (index === 0) return { x: 15, y: 20 };
    if (index === 1) return { x: 85, y: 18 };
    return { x: 50, y: 55 };
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, oklch(0.08 0.01 250 / 0.7) 100%)",
        }}
      />

      {/* Cork/fabric texture background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "oklch(0.12 0.01 250)",
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
          `,
          backgroundBlendMode: "soft-light",
          opacity: 0.95,
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Spotlight dim effect */}
      <motion.div
        className="absolute inset-0 bg-background/50 pointer-events-none z-10"
        animate={{ opacity: dimmed ? 0.5 : 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Subtle magnifying glass cursor follower */}
      <motion.div
        className="fixed w-6 h-6 pointer-events-none z-30 opacity-30"
        animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/50">
          <circle cx="10" cy="10" r="7" />
          <path d="M15 15 L21 21" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Red string connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <AnimatePresence>
          {showStrings &&
            stringConnections.map((conn, i) => {
              const from = getNoteCenter(conn.from);
              const to = getNoteCenter(conn.to);
              return (
                <motion.line
                  key={`string-${i}`}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="oklch(0.55 0.22 25)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.8, delay: i * 0.3 }}
                />
              );
            })}
          {showConclusion && (
            <motion.line
              x1="50%"
              y1="55%"
              x2="50%"
              y2="78%"
              stroke="oklch(0.55 0.22 25)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Evidence notes */}
      {evidenceNotes.map((note, index) => {
        const isRevealed = revealedCards.includes(index);
        const isHovered = hoveredCard === index;

        return (
          <motion.div
            key={index}
            className="absolute z-10 cursor-pointer"
            style={{
              ...note.position,
              transform: note.position.transform || undefined,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isHovered && !isRevealed ? 1.05 : 1,
              rotate: isHovered && !isRevealed ? note.rotate + (Math.random() - 0.5) * 3 : note.rotate,
            }}
            transition={{
              opacity: { delay: 0.5 + index * 0.2, duration: 0.5 },
              scale: { delay: 0.5 + index * 0.2, duration: 0.5 },
              rotate: { type: "spring", stiffness: 300 },
            }}
            whileTap={!isRevealed ? { scale: 1.15 } : undefined}
            onHoverStart={() => !isRevealed && setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => handleCardClick(index)}
          >
            {/* Pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-lg z-20 border border-red-800" />

            {/* Paper note */}
            <div
              className="relative w-[200px] md:w-[260px] overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fef9ef 0%, #f5eed6 100%)",
                boxShadow: isRevealed
                  ? "0 8px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)"
                  : "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {/* Paper texture */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative p-4 md:p-5">
                {/* Hidden text (always rendered for layout) */}
                <p
                  className={`font-serif text-sm md:text-base leading-relaxed transition-all duration-500 ${
                    isRevealed ? "text-amber-900" : "text-transparent"
                  }`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {note.text}
                </p>

                {/* Redaction bar overlay */}
                <AnimatePresence>
                  {!isRevealed && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4"
                      initial={{ x: 0 }}
                      exit={{ x: "120%", rotate: 5 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="w-full h-4 bg-foreground/90 rounded-sm" />
                      <div className="w-3/4 h-4 bg-foreground/90 rounded-sm" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Click hint */}
                {index === 0 && revealedCards.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-8 left-0 right-0 text-center text-xs text-foreground/60 italic"
                  >
                    clique para revelar
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Conclusion note - flies in from off-screen */}
      <AnimatePresence>
        {showConclusion && (
          <motion.div
            className="absolute z-20"
            style={{ top: "72%", left: "50%", transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: 300, x: "-50%", scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1, rotate: 2 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 100,
              duration: 0.8,
            }}
          >
            {/* Pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-lg z-20 border border-red-800" />

            {/* Paper note */}
            <div
              className="relative w-[280px] md:w-[340px] overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fffef5 0%, #f8f4e3 100%)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <div className="relative p-5 md:p-6">
                <p
                  className="font-serif text-base md:text-lg leading-relaxed text-amber-900 font-medium"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Conclusão: a medicação tem muita culpa.
                </p>

                {/* CULPADA stamp */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ opacity: 0, scale: 2, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                  transition={{ delay: 0.5, duration: 0.3, type: "spring", damping: 10 }}
                >
                  <div
                    className="px-4 py-2 border-4 border-red-600 text-red-600 font-bold text-2xl md:text-3xl tracking-wider uppercase"
                    style={{
                      fontFamily: "'Impact', 'Arial Black', sans-serif",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.1)",
                    }}
                  >
                    CULPADA
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
