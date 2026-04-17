"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Choice {
  label: string;
  isSuspeita: boolean;
  confession?: string;
}

interface Crime {
  id: number;
  order: number;
  title: string;
  choices: Choice[];
  position: {
    desktop: { top: string; left?: string; right?: string };
    mobile: { top: string; left?: string; right?: string };
  };
  rotate: number;
}

const crimes: Crime[] = [
  {
    id: 1,
    order: 1,
    title: "Ressona à noite... e parece um tractor",
    choices: [
      { label: "Constipação", isSuspeita: false, confession: "a constipação confessa: foi cúmplice." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: {
      desktop: { top: "6%", left: "4%" },
      mobile: { top: "4%", left: "6%" },
    },
    rotate: -4,
  },
  {
    id: 2,
    order: 2,
    title: "Arrotos a cheirar a ovo estrelado",
    choices: [
      { label: "Proteína a mais", isSuspeita: false, confession: "a proteína admite: foi cúmplice." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: {
      desktop: { top: "6%", right: "4%" },
      mobile: { top: "27%", right: "6%" },
    },
    rotate: 3,
  },
  {
    id: 3,
    order: 3,
    title: "Cheira mal dos suvacos",
    choices: [
      { label: "Não uso desodorizante", isSuspeita: false, confession: "válido. cúmplice." },
      { label: "Tá calor", isSuspeita: false, confession: "o calor admite: cúmplice." },
      { label: "Para de cheirar os meus odores corporais", isSuspeita: false, confession: "justo. mas ainda assim cúmplice." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: {
      desktop: { top: "50%", left: "4%" },
      mobile: { top: "49%", left: "6%" },
    },
    rotate: 2,
  },
  {
    id: 4,
    order: 4,
    title: "Dorme 2.132.171.241 horas seguidas",
    choices: [
      { label: "Soninho inocente", isSuspeita: false, confession: "o soninho era... só soninho." },
      { label: "Cama confortável", isSuspeita: false, confession: "a cama nega tudo." },
      { label: "Sofá confortável", isSuspeita: false, confession: "o sofá também nega." },
      { label: "Tudo o que dê para encostar", isSuspeita: false, confession: "fair point." },
      { label: "Mínino Sibi", isSuspeita: false, confession: "o mínino era inocente. provavelmente." },
      { label: "Medicação", isSuspeita: true },
    ],
    position: {
      desktop: { top: "50%", right: "4%" },
      mobile: { top: "73%", right: "6%" },
    },
    rotate: -2,
  },
];

const noteCentersDesktop = [
  { x: 21, y: 24 },
  { x: 79, y: 24 },
  { x: 21, y: 65 },
  { x: 79, y: 65 },
];

const noteCentersMobile = [
  { x: 35, y: 13 },
  { x: 66, y: 36 },
  { x: 35, y: 59 },
  { x: 66, y: 82 },
];

interface CardState {
  clickedNonSuspeita: string[];
  selectedSuspeita: boolean;
  lastConfession: string | null;
}

interface EvidenceBoardProps {
  onAllRevealed?: () => void;
}

const decorativePapers = [
  {
    top: "16%",
    left: "35%",
    rotate: "-8deg",
    width: "110px",
    height: "84px",
    tint: "#ece7db",
    inner: "#9ca3af",
  },
  {
    top: "58%",
    left: "39%",
    rotate: "6deg",
    width: "120px",
    height: "92px",
    tint: "#f1ebe0",
    inner: "#6b7280",
  },
  {
    top: "26%",
    right: "32%",
    rotate: "9deg",
    width: "96px",
    height: "78px",
    tint: "#efe6d6",
    inner: "#a3a3a3",
  },
];

function StringConnector({
  d,
  delay = 0,
}: {
  d: string;
  delay?: number;
}) {
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke="#7f1d1d"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.95 }}
        transition={{ duration: 0.8, delay }}
        style={{
          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.45))",
        }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#b91c1c"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.95 }}
        transition={{ duration: 0.8, delay }}
      />
    </g>
  );
}

export function EvidenceBoard({ onAllRevealed }: EvidenceBoardProps) {
  const [cardStates, setCardStates] = useState<Record<number, CardState>>({});
  const [showConclusion, setShowConclusion] = useState(false);
  const [unlockedOrder, setUnlockedOrder] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const allSuspeita = crimes.every((c) => cardStates[c.id]?.selectedSuspeita);

  useEffect(() => {
    if (allSuspeita && !showConclusion) {
      const t1 = setTimeout(() => {
        setShowConclusion(true);
        const t2 = setTimeout(() => onAllRevealed?.(), 2500);
        return () => clearTimeout(t2);
      }, 1200);

      return () => clearTimeout(t1);
    }
  }, [allSuspeita, showConclusion, onAllRevealed]);

  const handleChoice = (crime: Crime, choice: Choice) => {
    if (crime.order > unlockedOrder) return;

    const state =
      cardStates[crime.id] ?? {
        clickedNonSuspeita: [],
        selectedSuspeita: false,
        lastConfession: null,
      };

    if (state.selectedSuspeita) return;

    if (!choice.isSuspeita) {
      if (state.clickedNonSuspeita.includes(choice.label)) return;
      const newClicked = [...state.clickedNonSuspeita, choice.label];
      setCardStates((prev) => ({
        ...prev,
        [crime.id]: {
          ...state,
          clickedNonSuspeita: newClicked,
          lastConfession: choice.confession ?? null,
        },
      }));
    } else {
      const nonSuspeitaChoices = crime.choices.filter((c) => !c.isSuspeita);
      const allClicked = nonSuspeitaChoices.every((c) =>
        state.clickedNonSuspeita.includes(c.label)
      );
      if (!allClicked) return;

      setCardStates((prev) => ({
        ...prev,
        [crime.id]: { ...state, selectedSuspeita: true, lastConfession: null },
      }));

      setUnlockedOrder((prev) => prev + 1);
    }
  };

  const cardHasSuspeita = (id: number) => cardStates[id]?.selectedSuspeita === true;
  const isCardLocked = (crime: Crime) => crime.order > unlockedOrder;
  const isCardDone = (crime: Crime) => cardStates[crime.id]?.selectedSuspeita === true;
  const noteCenters = isMobile ? noteCentersMobile : noteCentersDesktop;

  return (
    <div className="fixed inset-0 bg-[#0a0d12] flex items-center justify-center p-2 sm:p-3 md:p-8 overflow-hidden">
      <motion.div
        className="relative w-full"
        style={{
          maxWidth: isMobile ? "440px" : "940px",
          width: isMobile ? "96vw" : "92vw",
          height: isMobile ? "90vh" : "78vh",
          backgroundImage: `
            radial-gradient(circle at 18% 20%, rgba(255,220,150,0.10), transparent 22%),
            radial-gradient(circle at 78% 28%, rgba(255,235,180,0.06), transparent 18%),
            radial-gradient(circle at 45% 76%, rgba(60,30,0,0.12), transparent 28%),
            linear-gradient(180deg, #9a6d20 0%, #845d18 100%),
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px),
            repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 8px),
            repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(70,40,0,0.035) 8px, rgba(70,40,0,0.035) 16px)
          `,
          border: isMobile ? "10px solid #2f2117" : "14px solid #2f2117",
          boxShadow: `
            0 35px 100px rgba(0,0,0,0.9),
            inset 0 0 60px rgba(0,0,0,0.32),
            inset 0 10px 20px rgba(255,255,255,0.05),
            0 0 0 2px #5e4028,
            0 0 0 7px #17100b
          `,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            mixBlendMode: "multiply",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, transparent 52%, rgba(0,0,0,0.30) 100%)",
            mixBlendMode: "multiply",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `
              inset 0 0 0 10px #3b281c,
              inset 0 0 0 12px #1f140e,
              inset 0 0 18px rgba(255,255,255,0.03),
              inset 0 -8px 18px rgba(0,0,0,0.25)
            `,
          }}
        />

        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none z-[4]">
            {decorativePapers.map((paper, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: paper.top,
                  left: paper.left,
                  right: paper.right,
                  transform: `rotate(${paper.rotate})`,
                  width: paper.width,
                  height: paper.height,
                  background: paper.tint,
                  padding: "8px 8px 18px 8px",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.30)",
                  border: "1px solid rgba(80,60,20,0.10)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${paper.inner}, #d4d4d8)`,
                    opacity: 0.75,
                  }}
                />
              </div>
            ))}

            <div
              className="absolute top-[40%] left-[49%] text-red-900/30 text-[12px] font-bold tracking-[0.28em] -rotate-[12deg]"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              EVIDÊNCIA
            </div>

            <div
              className="absolute top-[31%] left-[50%] w-14 h-14 rounded-full border-[3px] border-red-900/20"
              style={{ transform: "rotate(-8deg)" }}
            />
          </div>
        )}

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <AnimatePresence>
            {cardHasSuspeita(1) && (
              <StringConnector
                key="string-1-2"
                d={
                  isMobile
                    ? `M ${noteCenters[0].x} ${noteCenters[0].y} C 42 16, 56 26, ${noteCenters[1].x} ${noteCenters[1].y}`
                    : `M ${noteCenters[0].x} ${noteCenters[0].y} C 34 19, 62 30, ${noteCenters[1].x} ${noteCenters[1].y}`
                }
              />
            )}

            {cardHasSuspeita(2) && (
              <StringConnector
                key="string-2-3"
                d={
                  isMobile
                    ? `M ${noteCenters[1].x} ${noteCenters[1].y} C 62 42, 42 50, ${noteCenters[2].x} ${noteCenters[2].y}`
                    : `M ${noteCenters[1].x} ${noteCenters[1].y} C 75 35, 33 48, ${noteCenters[2].x} ${noteCenters[2].y}`
                }
                delay={0.06}
              />
            )}

            {cardHasSuspeita(3) && (
              <StringConnector
                key="string-3-4"
                d={
                  isMobile
                    ? `M ${noteCenters[2].x} ${noteCenters[2].y} C 44 66, 58 76, ${noteCenters[3].x} ${noteCenters[3].y}`
                    : `M ${noteCenters[2].x} ${noteCenters[2].y} C 36 61, 64 58, ${noteCenters[3].x} ${noteCenters[3].y}`
                }
                delay={0.06}
              />
            )}

            {cardHasSuspeita(4) && (
              <StringConnector
                key="string-4-final"
                d={
                  isMobile
                    ? `M ${noteCenters[3].x} ${noteCenters[3].y} C 68 86, 58 90, 50 94`
                    : `M ${noteCenters[3].x} ${noteCenters[3].y} C 74 77, 59 84, 50 91`
                }
                delay={0.06}
              />
            )}
          </AnimatePresence>
        </svg>

        <div className="absolute inset-0 pointer-events-none z-[15]">
          {noteCenters.map((point, idx) => {
            const visible =
              idx === 0
                ? cardHasSuspeita(1)
                : idx === 1
                ? cardHasSuspeita(1) || cardHasSuspeita(2)
                : idx === 2
                ? cardHasSuspeita(2) || cardHasSuspeita(3)
                : cardHasSuspeita(3) || cardHasSuspeita(4);

            if (!visible) return null;

            return (
              <div
                key={idx}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle at 35% 35%, #ef4444, #7f1d1d 70%)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.45)",
                  border: "1px solid #4c0519",
                }}
              />
            );
          })}

          {cardHasSuspeita(4) && (
            <div
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: "50%",
                top: isMobile ? "94%" : "91%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle at 35% 35%, #ef4444, #7f1d1d 70%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.45)",
                border: "1px solid #4c0519",
              }}
            />
          )}
        </div>

        {crimes.map((crime, index) => {
          const state = cardStates[crime.id];
          const locked = isCardLocked(crime);
          const done = isCardDone(crime);
          const isLastCard = crime.id === 4;
          const nonSuspeitaChoices = crime.choices.filter((c) => !c.isSuspeita);
          const allNonSuspeitaClicked = nonSuspeitaChoices.every((c) =>
            state?.clickedNonSuspeita.includes(c.label)
          );

          const position = isMobile ? crime.position.mobile : crime.position.desktop;

          return (
            <motion.div
              key={crime.id}
              className="absolute z-20"
              style={position}
              initial={{ opacity: 0, scale: 0, rotate: crime.rotate - 8 }}
              animate={{
                opacity: locked ? 0.38 : 1,
                scale: 1,
                rotate: crime.rotate,
                filter: locked ? "grayscale(0.55)" : "none",
              }}
              transition={{
                delay: 0.2 + index * 0.15,
                type: "spring",
                damping: 14,
              }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full z-30"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #ef4444, #991b1b 70%)",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
                  border: "1px solid #5f0f0f",
                }}
              />

              <div
                className="absolute -top-3 -left-3 w-5 h-5 rounded-full flex items-center justify-center z-30"
                style={{
                  background: done ? "#166534" : locked ? "#4b5563" : "#b91c1c",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "'Courier New', monospace",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                {done ? "✓" : crime.order}
              </div>

              <div
                className={`relative ${
                  isMobile
                    ? "w-[220px]"
                    : isLastCard
                    ? "w-[280px] md:w-[340px]"
                    : "w-[240px] md:w-[300px]"
                }`}
                style={{
                  background: "linear-gradient(135deg, #fffdf4 0%, #f2e8cf 100%)",
                  boxShadow: locked
                    ? "0 4px 14px rgba(0,0,0,0.25)"
                    : "0 8px 28px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.55)",
                  padding: isMobile ? "12px 13px 14px" : "14px 16px 16px",
                  border: "1px solid rgba(120,80,20,0.16)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.16]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
                    mixBlendMode: "multiply",
                  }}
                />

                <div
                  className="absolute top-[-8px] left-1/2 -translate-x-1/2 rotate-[-7deg] w-11 h-4 z-30"
                  style={{
                    background: "rgba(255,244,185,0.50)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    backdropFilter: "blur(1px)",
                  }}
                />

                <div
                  className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 48%, rgba(120,90,40,0.16) 49%, rgba(120,90,40,0.16) 100%)",
                  }}
                />

                <div
                  className="mb-2 text-[9px] md:text-[10px] tracking-[0.22em] uppercase text-amber-900/60"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  ficheiro de caso #{crime.id.toString().padStart(2, "0")}
                </div>

                <h3
                  className="font-serif text-sm md:text-base lg:text-lg text-amber-900 font-semibold mb-3 leading-snug"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {crime.title}
                </h3>

                {locked && (
                  <p
                    style={{
                      fontSize: isMobile ? "0.58rem" : "0.62rem",
                      color: "#92400e",
                      fontStyle: "italic",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    resolve a evidência {crime.order - 1} primeiro.
                  </p>
                )}

                {!locked && (
                  <div className="space-y-1.5">
                    {crime.choices.map((choice) => {
                      const isClickedNonSuspeita = state?.clickedNonSuspeita.includes(choice.label);
                      const isSuspeitaSelected = done && choice.isSuspeita;
                      const isMedicacaoBlocked =
                        choice.isSuspeita && !allNonSuspeitaClicked && !done;

                      return (
                        <div
                          key={choice.label}
                          onClick={() => !isMedicacaoBlocked && handleChoice(crime, choice)}
                          className="flex items-center gap-1.5 select-none"
                          style={{
                            opacity:
                              done && !isSuspeitaSelected
                                ? 0.3
                                : isMedicacaoBlocked
                                ? 0.25
                                : 1,
                            cursor: done || isMedicacaoBlocked ? "default" : "pointer",
                          }}
                        >
                          <motion.div
                            className="flex-shrink-0 w-2.5 h-2.5 rounded-full border"
                            animate={{
                              backgroundColor: isSuspeitaSelected
                                ? "#d97706"
                                : isClickedNonSuspeita
                                ? "#dc2626"
                                : "rgba(0,0,0,0)",
                              borderColor: isSuspeitaSelected
                                ? "#d97706"
                                : isClickedNonSuspeita
                                ? "#dc2626"
                                : "rgba(120,80,0,0.35)",
                            }}
                            transition={{ duration: 0.2 }}
                          />
                          <span
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontSize: isMobile ? "0.8rem" : "0.9rem",
                              color: isClickedNonSuspeita
                                ? "#991b1b"
                                : isSuspeitaSelected
                                ? "#92400e"
                                : "#78350f",
                              textDecoration: isClickedNonSuspeita
                                ? "line-through #991b1b"
                                : "none",
                              lineHeight: 1.3,
                            }}
                          >
                            {choice.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <AnimatePresence>
                  {state?.lastConfession && !done && (
                    <motion.p
                      key={state.lastConfession}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5 italic"
                      style={{
                        fontSize: isMobile ? "0.65rem" : "0.72rem",
                        color: "#991b1b",
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {state.lastConfession}
                    </motion.p>
                  )}
                </AnimatePresence>

                {!locked && !done && !allNonSuspeitaClicked && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.35, 0.72, 0.35] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      fontSize: isMobile ? "0.63rem" : "0.69rem",
                      color: "#92400e",
                      fontStyle: "italic",
                      marginTop: "6px",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    clica em todas as opções primeiro...
                  </motion.p>
                )}

                <AnimatePresence>
                  {done && (
                    <motion.div
                      key="suspeita-stamp"
                      className="absolute top-1.5 right-1.5 pointer-events-none"
                      initial={{ opacity: 0, scale: 2, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 12 }}
                    >
                      <span
                        className="font-bold border px-1.5 py-0.5"
                        style={{
                          fontSize: isMobile ? "0.52rem" : "0.58rem",
                          color: "#991b1b",
                          borderColor: "rgba(153,27,27,0.65)",
                          backgroundColor: "rgba(255,245,245,0.35)",
                          letterSpacing: "0.08em",
                          fontFamily: "'Impact', 'Arial Black', sans-serif",
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

        <AnimatePresence>
          {showConclusion && (
            <motion.div
              key="conclusion-dossier"
              className="absolute z-40 left-1/2"
              style={{ bottom: isMobile ? "1.5%" : "3%", transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: -180, x: "-50%", scale: 0.5, rotate: 14 }}
              animate={{ opacity: 1, y: 0, x: "-50%", scale: 1, rotate: 2 }}
              transition={{ type: "spring", damping: 11, stiffness: 70 }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-700 shadow-lg z-20 border-2 border-red-950" />
              <div
                className="relative"
                style={{
                  width: isMobile ? "190px" : "270px",
                  background: "linear-gradient(135deg, #fffef5 0%, #f5eedb 100%)",
                  boxShadow: "0 16px 55px rgba(0,0,0,0.65)",
                  padding: isMobile ? "18px 22px" : "22px 28px",
                  textAlign: "center",
                  border: "1px solid rgba(120,80,20,0.14)",
                }}
              >
                <div
                  className="mb-2 text-[10px] uppercase tracking-[0.25em] text-amber-900/60"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  relatório final
                </div>

                <h2
                  className="font-serif text-xl md:text-2xl text-amber-900 font-bold tracking-wide"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  A MEDICAÇÃO
                </h2>

                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ opacity: 0, scale: 2.5, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: -15 }}
                  transition={{
                    delay: 0.4,
                    type: "spring",
                    damping: 8,
                    stiffness: 200,
                  }}
                >
                  <div
                    className="px-3 py-1 border-[3px] border-red-700 text-red-700 font-bold text-2xl md:text-3xl tracking-widest uppercase"
                    style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                  >
                    CULPADA
                  </div>
                </motion.div>

                <motion.p
                  className="mt-8 text-xs italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  style={{
                    color: "#92400e",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  caso encerrado.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="fixed bottom-0 left-2 sm:left-4 z-10 md:z-20 flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, duration: 0.8, type: "spring", damping: 16 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, type: "spring", damping: 14 }}
          style={{
            background: "white",
            borderRadius: "10px",
            padding: isMobile ? "8px 12px" : "10px 16px",
            marginBottom: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            position: "relative",
            whiteSpace: "nowrap",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: isMobile ? "12px" : "14px",
              fontStyle: "italic",
              color: "#111",
              fontWeight: 700,
            }}
          >
            A investigar...
          </p>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%) translateY(100%)",
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "8px solid white",
            }}
          />
        </motion.div>

        <div className="relative">
          <svg
            className="absolute z-30 w-16 sm:w-20 md:w-28 h-auto"
            viewBox="0 0 80 40"
            style={{
              top: "18%",
              left: "72%",
              transform: "translate(-50%, -50%) rotate(30deg)",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))",
            }}
          >
            <rect x="3" y="28" width="74" height="7" rx="2" fill="#111" />
            <rect x="14" y="6" width="52" height="24" rx="3" fill="#222" />
            <rect x="14" y="23" width="52" height="7" fill="#7B3F00" />
            <rect x="18" y="9" width="12" height="3" rx="1" fill="rgba(255,255,255,0.08)" />
          </svg>

          <img
            src="/sibi.jpeg"
            alt="Sibi detetive"
            className="w-24 sm:w-36 md:w-72 h-auto relative z-20"
          />
        </div>
      </motion.div>
    </div>
  );
}