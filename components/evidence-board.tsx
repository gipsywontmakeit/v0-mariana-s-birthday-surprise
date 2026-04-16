"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Crime {
  id: number;
  title: string;
  choices: {
    label: string;
    isSuspeita: boolean;
    confession?: string;
  }[];
  position: { top: string; left?: string; right?: string };
  rotate: number;
}

const crimes: Crime[] = [
  {
    id: 1,
    title: "Ressona à noite... e parece um tractor",
    choices: [
      { label: "Constipação", isSuspeita: false, confession: "a constipação confessa: foi cúmplice." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: { top: "10%", left: "5%" },
    rotate: -4,
  },
  {
    id: 2,
    title: "Arrotos a cheirar a ovo estrelado",
    choices: [
      { label: "Proteína a mais", isSuspeita: false, confession: "a proteína admite: foi cúmplice." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: { top: "10%", right: "5%" },
    rotate: 3,
  },
  {
    id: 3,
    title: "Dorme 2.132.171.241 horas seguidas",
    choices: [
      { label: "Soninho inocente", isSuspeita: false, confession: "o soninho era... só soninho." },
      { label: "Cama confortável", isSuspeita: false, confession: "a cama nega tudo." },
      { label: "Sofá confortável", isSuspeita: false, confession: "o sofá também nega." },
      { label: "Tudo o que dê para encostar", isSuspeita: false, confession: "fair point." },
      { label: "Minino Sibi", isSuspeita: false, confession: "o minino era inocente. provavelmente." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: { top: "46%", left: "50%" },
    rotate: -1,
  },
];

// Centers as % of the board div
const noteCenters = [
  { x: 22, y: 26 },
  { x: 78, y: 24 },
  { x: 50, y: 60 },
];

interface CardState {
  selectedChoice: string | null;
  isSuspeita: boolean;
  confession: string | null;
}

interface EvidenceBoardProps {
  onAllRevealed?: () => void;
}

export function EvidenceBoard({ onAllRevealed }: EvidenceBoardProps) {
  const [cardStates, setCardStates] = useState<Record<number, CardState>>({});
  const [showConclusion, setShowConclusion] = useState(false);

  const suspeitaCount = Object.values(cardStates).filter((s) => s.isSuspeita).length;
  const allSuspeita = suspeitaCount === 3;

  useEffect(() => {
    if (allSuspeita && !showConclusion) {
      setTimeout(() => {
        setShowConclusion(true);
        setTimeout(() => {
          onAllRevealed?.();
        }, 2500);
      }, 1200);
    }
  }, [allSuspeita, showConclusion, onAllRevealed]);

  const handleChoice = (crimeId: number, choice: Crime["choices"][0]) => {
    if (cardStates[crimeId]?.isSuspeita) return;
    setCardStates((prev) => ({
      ...prev,
      [crimeId]: {
        selectedChoice: choice.label,
        isSuspeita: choice.isSuspeita,
        confession: choice.isSuspeita ? null : choice.confession || null,
      },
    }));
  };

  const cardHasSuspeita = (id: number) => cardStates[id]?.isSuspeita === true;

  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center p-4 md:p-10">
      {/* Cork Board */}
      <motion.div
        className="relative w-full"
        style={{
          maxWidth: "880px",
          height: "78vh",
          backgroundColor: "#8B6914",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
            repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(139,105,20,0.08) 5px, rgba(139,105,20,0.08) 10px)
          `,
          border: "14px solid #2d1f14",
          boxShadow:
            "0 30px 90px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.25), 0 0 0 3px #5a3e28, 0 0 0 4px #2d1f14",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Cork noise texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            mixBlendMode: "multiply",
          }}
        />

        {/* Red string connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <AnimatePresence>
            {cardHasSuspeita(1) && (
              <motion.line
                key="string-1-3"
                x1={`${noteCenters[0].x}%`}
                y1={`${noteCenters[0].y}%`}
                x2={`${noteCenters[2].x}%`}
                y2={`${noteCenters[2].y}%`}
                stroke="#c41e3a"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {cardHasSuspeita(2) && (
              <motion.line
                key="string-2-3"
                x1={`${noteCenters[1].x}%`}
                y1={`${noteCenters[1].y}%`}
                x2={`${noteCenters[2].x}%`}
                y2={`${noteCenters[2].y}%`}
                stroke="#c41e3a"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {cardHasSuspeita(3) && (
              <motion.line
                key="string-3-conclusion"
                x1={`${noteCenters[2].x}%`}
                y1={`${noteCenters[2].y}%`}
                x2="50%"
                y2="90%"
                stroke="#c41e3a"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>
        </svg>

        {/* Crime cards */}
        {crimes.map((crime, index) => {
          const state = cardStates[crime.id];
          const isThirdCard = crime.id === 3;

          return (
            <motion.div
              key={crime.id}
              className="absolute z-10"
              style={{
                ...crime.position,
                ...(isThirdCard ? { transform: "translateX(-50%)" } : {}),
              }}
              initial={{ opacity: 0, scale: 0, rotate: crime.rotate - 8 }}
              animate={{ opacity: 1, scale: 1, rotate: crime.rotate }}
              transition={{ delay: 0.3 + index * 0.2, type: "spring", damping: 14 }}
            >
              {/* Pin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-lg z-20 border border-red-800" />

              {/* Paper note */}
              <div
                className={`relative ${isThirdCard ? "w-[240px] md:w-[290px]" : "w-[185px] md:w-[230px]"}`}
                style={{
                  background: "linear-gradient(135deg, #fef9ef 0%, #f5eed6 100%)",
                  boxShadow: "0 6px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)",
                  padding: "12px 14px 14px",
                }}
              >
                <h3
                  className="font-serif text-xs md:text-sm text-amber-900 font-semibold mb-3 leading-snug"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {crime.title}
                </h3>

                {/* Creative choices — clickable text items, no buttons */}
                <div className="space-y-2">
                  {crime.choices.map((choice) => {
                    const isSelected = state?.selectedChoice === choice.label;
                    const isDisabled = state?.isSuspeita && !isSelected;
                    const isSuspeitaSelected = isSelected && choice.isSuspeita;
                    const isCumpliceSelected = isSelected && !choice.isSuspeita;

                    return (
                      <div
                        key={choice.label}
                        onClick={() => !isDisabled && !isSelected && handleChoice(crime.id, choice)}
                        className="flex items-center gap-2 select-none group"
                        style={{
                          opacity: isDisabled ? 0.3 : 1,
                          cursor: isDisabled || isSelected ? "default" : "pointer",
                        }}
                      >
                        {/* Circle indicator */}
                        <motion.div
                          className="flex-shrink-0 w-3 h-3 rounded-full border"
                          animate={{
                            backgroundColor: isSuspeitaSelected
                              ? "#d97706"
                              : isCumpliceSelected
                              ? "#dc2626"
                              : "transparent",
                            borderColor: isSuspeitaSelected
                              ? "#d97706"
                              : isCumpliceSelected
                              ? "#dc2626"
                              : "rgba(120,80,0,0.35)",
                            scale: isSelected ? 1.2 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        />
                        <span
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "0.7rem",
                            color: isCumpliceSelected ? "#991b1b" : isSuspeitaSelected ? "#92400e" : "#78350f",
                            textDecoration: isCumpliceSelected ? "line-through" : "none",
                            textDecorationColor: "#991b1b",
                            lineHeight: 1.3,
                          }}
                        >
                          {choice.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Confession */}
                <AnimatePresence>
                  {state?.confession && (
                    <motion.p
                      key="confession"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 text-red-700 italic"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {state.confession}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Stamps */}
                <AnimatePresence>
                  {state?.isSuspeita === false && state?.selectedChoice && (
                    <motion.div
                      key="cumplice-stamp"
                      className="absolute top-2 right-2 pointer-events-none"
                      initial={{ opacity: 0, scale: 1.8, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 12 }}
                    >
                      <span
                        className="font-serif italic font-bold border px-1.5 py-0.5 rounded"
                        style={{
                          fontSize: "0.6rem",
                          color: "#dc2626",
                          borderColor: "#fca5a5",
                          backgroundColor: "rgba(254,242,242,0.9)",
                        }}
                      >
                        CUMPLICE
                      </span>
                    </motion.div>
                  )}
                  {state?.isSuspeita === true && (
                    <motion.div
                      key="suspeita-stamp"
                      className="absolute top-2 right-2 pointer-events-none"
                      initial={{ opacity: 0, scale: 1.8, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 12 }}
                    >
                      <span
                        className="font-serif italic font-bold border px-1.5 py-0.5 rounded"
                        style={{
                          fontSize: "0.6rem",
                          color: "#92400e",
                          borderColor: "#fcd34d",
                          backgroundColor: "rgba(255,251,235,0.9)",
                        }}
                      >
                        SUSPEITA
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {/* Sibi — big, bottom-left, detective hat, no speech bubble */}
        <motion.div
          className="absolute bottom-0 left-3 z-10"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8, type: "spring", damping: 16 }}
        >
          <div className="relative">
            <img
              src="/sibi.jpeg"
              alt="Sibi the detective cat"
              className="w-36 md:w-48 h-auto"
            />
            {/* Detective hat */}
            <svg
              className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 w-24 md:w-32 h-auto"
              viewBox="0 0 80 40"
            >
              {/* Brim */}
              <rect x="3" y="28" width="74" height="7" rx="2" fill="#111" />
              {/* Body */}
              <rect x="14" y="6" width="52" height="24" rx="3" fill="#222" />
              {/* Band */}
              <rect x="14" y="23" width="52" height="7" fill="#7B3F00" />
              {/* Shine */}
              <rect x="18" y="9" width="12" height="3" rx="1" fill="rgba(255,255,255,0.08)" />
            </svg>
          </div>
        </motion.div>

        {/* Conclusion dossier */}
        <AnimatePresence>
          {showConclusion && (
            <motion.div
              key="conclusion-dossier"
              className="absolute z-20 left-1/2"
              style={{ bottom: "5%", transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: -180, x: "-50%", scale: 0.5, rotate: 14 }}
              animate={{ opacity: 1, y: 0, x: "-50%", scale: 1, rotate: 2 }}
              transition={{ type: "spring", damping: 11, stiffness: 70 }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-600 shadow-lg z-20 border-2 border-red-900" />
              <div
                className="relative w-[230px] md:w-[290px]"
                style={{
                  background: "linear-gradient(135deg, #fffef5 0%, #f8f4e3 100%)",
                  boxShadow: "0 14px 50px rgba(0,0,0,0.6)",
                  padding: "24px 32px",
                  textAlign: "center",
                }}
              >
                <h2
                  className="font-serif text-2xl md:text-3xl text-amber-900 font-bold tracking-wide"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  A MEDICAÇÃO
                </h2>

                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ opacity: 0, scale: 2.5, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: -15 }}
                  transition={{ delay: 0.4, type: "spring", damping: 8, stiffness: 200 }}
                >
                  <div
                    className="px-4 py-1 border-[3px] border-red-600 text-red-600 font-bold text-3xl md:text-4xl tracking-widest uppercase"
                    style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                  >
                    CULPADA
                  </div>
                </motion.div>

                <motion.p
                  className="mt-10 text-sm text-amber-700 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  caso encerrado.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
