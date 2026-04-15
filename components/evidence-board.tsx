"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Crime {
  id: number;
  title: string;
  choices: {
    label: string;
    isSuspeita: boolean;
    confession?: string;
    hasImage?: boolean;
    imageSrc?: string;
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
    position: { top: "15%", left: "8%" },
    rotate: -4,
  },
  {
    id: 2,
    title: "Arrotos a cheirar a ovo estrelado",
    choices: [
      { label: "Proteína a mais", isSuspeita: false, confession: "a proteína admite: foi cúmplice." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: { top: "12%", right: "8%" },
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
      { label: "Minino sibi", isSuspeita: false, confession: "o minino era inocente. provavelmente.", hasImage: true, imageSrc: "/sibi.jpg" },
      { label: "Medicação", isSuspeita: true },
    ],
    position: { top: "52%", left: "50%" },
    rotate: -1,
  },
];

// Note centers for string drawing (percentages)
const noteCenters = [
  { x: 18, y: 28 },  // Card 1
  { x: 82, y: 25 },  // Card 2  
  { x: 50, y: 65 },  // Card 3
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const suspeitaCount = Object.values(cardStates).filter(s => s.isSuspeita).length;
  const allSuspeita = suspeitaCount === 3;

  // Show conclusion after all 3 marked suspeita
  useEffect(() => {
    if (allSuspeita && !showConclusion) {
      setTimeout(() => {
        setShowConclusion(true);
        setTimeout(() => {
          onAllRevealed?.();
        }, 2000);
      }, 1500);
    }
  }, [allSuspeita, showConclusion, onAllRevealed]);

  const handleChoice = (crimeId: number, choice: Crime["choices"][0]) => {
    if (cardStates[crimeId]?.isSuspeita) return; // Already marked suspeita, no more changes

    setCardStates(prev => ({
      ...prev,
      [crimeId]: {
        selectedChoice: choice.label,
        isSuspeita: choice.isSuspeita,
        confession: choice.isSuspeita ? null : choice.confession || null,
      },
    }));
  };

  // Check if a card has suspeita selected
  const cardHasSuspeita = (id: number) => cardStates[id]?.isSuspeita === true;

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

      {/* Subtle magnifying glass cursor follower */}
      <motion.div
        className="fixed w-6 h-6 pointer-events-none z-30 opacity-30 hidden md:block"
        animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/50">
          <circle cx="10" cy="10" r="7" />
          <path d="M15 15 L21 21" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Red string connections - only appear after SUSPEITA */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {/* String from card 1 to card 3 */}
        <AnimatePresence>
          {cardHasSuspeita(1) && (
            <motion.line
              key="string-1-3"
              x1={`${noteCenters[0].x}%`}
              y1={`${noteCenters[0].y}%`}
              x2={`${noteCenters[2].x}%`}
              y2={`${noteCenters[2].y}%`}
              stroke="oklch(0.55 0.22 25)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>

        {/* String from card 2 to card 3 */}
        <AnimatePresence>
          {cardHasSuspeita(2) && (
            <motion.line
              key="string-2-3"
              x1={`${noteCenters[1].x}%`}
              y1={`${noteCenters[1].y}%`}
              x2={`${noteCenters[2].x}%`}
              y2={`${noteCenters[2].y}%`}
              stroke="oklch(0.55 0.22 25)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>

        {/* String from card 3 to conclusion */}
        <AnimatePresence>
          {cardHasSuspeita(3) && (
            <motion.line
              key="string-3-conclusion"
              x1={`${noteCenters[2].x}%`}
              y1={`${noteCenters[2].y}%`}
              x2="50%"
              y2="88%"
              stroke="oklch(0.55 0.22 25)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Crime cards */}
      {crimes.map((crime, index) => {
        const state = cardStates[crime.id];
        const isHovered = hoveredCard === crime.id;
        const isThirdCard = crime.id === 3;

        return (
          <motion.div
            key={crime.id}
            className="absolute z-10"
            style={{
              ...crime.position,
              ...(isThirdCard ? { transform: "translateX(-50%)" } : {}),
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isHovered && !state?.isSuspeita ? 1.03 : 1,
              rotate: crime.rotate,
            }}
            transition={{
              opacity: { delay: 0.5 + index * 0.2, duration: 0.5 },
              scale: { delay: 0.5 + index * 0.2, duration: 0.5 },
            }}
            onHoverStart={() => setHoveredCard(crime.id)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            {/* Pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-lg z-20 border border-red-800" />

            {/* Paper note */}
            <div
              className={`relative overflow-hidden ${isThirdCard ? "w-[280px] md:w-[340px]" : "w-[220px] md:w-[280px]"}`}
              style={{
                background: "linear-gradient(135deg, #fef9ef 0%, #f5eed6 100%)",
                boxShadow: "0 6px 25px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
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
                {/* Crime title */}
                <h3
                  className="font-serif text-sm md:text-base text-amber-900 font-medium mb-4 leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {crime.title}
                </h3>

                {/* Choice buttons */}
                <div className={`flex flex-wrap gap-2 ${isThirdCard ? "grid grid-cols-2" : ""}`}>
                  {crime.choices.map((choice) => {
                    const isSelected = state?.selectedChoice === choice.label;
                    const isDisabled = state?.isSuspeita && !isSelected;
                    const showAsCumplice = isSelected && !choice.isSuspeita;
                    const showAsSuspeita = isSelected && choice.isSuspeita;

                    return (
                      <button
                        key={choice.label}
                        onClick={() => handleChoice(crime.id, choice)}
                        disabled={isDisabled || showAsSuspeita}
                        className={`
                          relative px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all
                          ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:scale-105 cursor-pointer"}
                          ${showAsCumplice ? "bg-red-100 text-red-800 border border-red-300" : ""}
                          ${showAsSuspeita ? "bg-amber-100 text-amber-800 border border-amber-400" : ""}
                          ${!isSelected ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : ""}
                        `}
                      >
                        <span className="flex items-center gap-1.5">
                          {choice.hasImage && (
                            <span className="relative w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 inline-flex items-center justify-center">
                              <Image
                                src={choice.imageSrc || ""}
                                alt={choice.label}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <span className="text-[10px] text-gray-500">cat</span>
                            </span>
                          )}
                          {choice.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Confession note for CÚMPLICE */}
                <AnimatePresence>
                  {state?.confession && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-xs text-red-700 italic"
                    >
                      {state.confession}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Stamp overlays */}
                <AnimatePresence>
                  {state?.isSuspeita === false && state?.selectedChoice && (
                    <motion.div
                      className="absolute top-3 right-3 pointer-events-none"
                      initial={{ opacity: 0, scale: 1.5, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 12 }}
                    >
                      <span className="text-red-600 font-serif italic text-xs md:text-sm font-bold border border-red-400 px-2 py-0.5 rounded bg-red-50/80">
                        CUMPLICE
                      </span>
                    </motion.div>
                  )}
                  {state?.isSuspeita === true && (
                    <motion.div
                      className="absolute top-3 right-3 pointer-events-none"
                      initial={{ opacity: 0, scale: 1.5, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 12 }}
                    >
                      <span className="text-amber-700 font-serif italic text-xs md:text-sm font-bold border border-amber-500 px-2 py-0.5 rounded bg-amber-50/80">
                        SUSPEITA
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Conclusion dossier - flies in after all suspeita */}
      <AnimatePresence>
        {showConclusion && (
          <motion.div
            className="absolute z-20 left-1/2"
            style={{ top: "82%", transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: -200, x: "-50%", scale: 0.5, rotate: 15 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1, rotate: 2 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 80,
              duration: 0.8,
            }}
          >
            {/* Pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-600 shadow-lg z-20 border-2 border-red-800" />

            {/* Dossier note */}
            <div
              className="relative w-[260px] md:w-[320px] overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fffef5 0%, #f8f4e3 100%)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <div className="relative p-6 md:p-8 text-center">
                <h2
                  className="font-serif text-2xl md:text-3xl text-amber-900 font-bold tracking-wide"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  A MEDICACAO
                </h2>

                {/* CULPADA stamp */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ opacity: 0, scale: 2.5, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: -15 }}
                  transition={{ delay: 0.4, duration: 0.25, type: "spring", damping: 8, stiffness: 200 }}
                >
                  <div
                    className="px-5 py-2 border-[3px] border-red-600 text-red-600 font-bold text-3xl md:text-4xl tracking-widest uppercase bg-white/30"
                    style={{
                      fontFamily: "'Impact', 'Arial Black', sans-serif",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.1)",
                    }}
                  >
                    CULPADA
                  </div>
                </motion.div>

                <motion.p
                  className="mt-10 text-sm text-amber-700 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  caso encerrado.
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
