"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Confetti } from "@/components/confetti";

interface MapRevealProps {
  onComplete?: () => void;
}

type Phase = "cards" | "boarding-pass" | "final";

function TypeLine({
  text,
  start,
  speed = 90,
  onDone,
  className = "",
  cursorColorClass = "text-pink-300",
}: {
  text: string;
  start: boolean;
  speed?: number;
  onDone?: () => void;
  className?: string;
  cursorColorClass?: string;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!start) return;

    setShown("");
    let i = 0;

    const timer = setInterval(() => {
      if (i <= text.length) {
        setShown(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [start, text, speed, onDone]);

  return (
    <p className={className}>
      {shown}
      {start && shown.length < text.length && (
        <span className={`inline-block ml-1 animate-pulse ${cursorColorClass}`}>|</span>
      )}
    </p>
  );
}

function FloatingMorangos() {
  const items = useMemo(() => {
    const generated: {
      id: number;
      left: string;
      top: string;
      size: number;
      duration: number;
      delay: number;
      rotate: number;
    }[] = [];

    const isInsideSafeZone = (x: number, y: number) => {
      return x > 14 && x < 86 && y > 14 && y < 86;
    };

    let attempts = 0;
    while (generated.length < 280 && attempts < 20000) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      if (!isInsideSafeZone(x, y)) {
        generated.push({
          id: generated.length,
          left: `${x}%`,
          top: `${y}%`,
          size: 14 + Math.random() * 38,
          duration: 3.2 + Math.random() * 3.6,
          delay: Math.random() * 2.8,
          rotate: (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 22),
        });
      }

      attempts++;
    }

    return generated;
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {items.map((item) => (
        <motion.img
          key={item.id}
          src="/morango.png"
          alt=""
          className="absolute select-none opacity-95"
          style={{
            left: item.left,
            top: item.top,
            width: `${item.size}px`,
            height: "auto",
          }}
          initial={{ opacity: 0, scale: 0.35, y: 8, rotate: 0 }}
          animate={{
            opacity: 0.95,
            scale: 1,
            y: [0, -8, 0],
            x: [0, 4, -3, 0],
            rotate: [0, item.rotate, -item.rotate * 0.55, 0],
          }}
          transition={{
            opacity: { duration: 0.4, delay: item.delay },
            scale: { duration: 0.45, delay: item.delay },
            y: {
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            },
            x: {
              duration: item.duration + 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            },
            rotate: {
              duration: item.duration + 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            },
          }}
        />
      ))}
    </div>
  );
}

function RevealCard({
  image,
  label,
  revealed,
  accent,
  delay,
  onClick,
  disabled = false,
  isJoe = false,
  joeCentered = false,
}: {
  image: string;
  label: string;
  revealed: boolean;
  accent: string;
  delay: number;
  onClick?: () => void;
  disabled?: boolean;
  isJoe?: boolean;
  joeCentered?: boolean;
}) {
  const isDimmed = joeCentered && !isJoe;
  const isFocused = joeCentered && isJoe;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || revealed}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{
        opacity: isDimmed ? 0.2 : 1,
        scale: isFocused ? 1.18 : isDimmed ? 0.7 : 1,
        filter: isDimmed ? "blur(2px)" : "none",
      }}
      whileHover={!disabled && !revealed && !joeCentered ? { y: -8, scale: 1.03 } : {}}
      whileTap={!disabled && !revealed ? { scale: 0.97 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="group relative w-[170px] sm:w-[220px] md:w-[360px] lg:w-[420px]"
      style={{
        cursor: disabled || revealed ? "default" : "pointer",
        zIndex: isFocused ? 40 : 10,
      }}
    >
      <div className="relative overflow-hidden rounded-[26px]">
        <img
          src={image}
          alt={label}
          className="w-full aspect-square object-cover select-none rounded-[26px] transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {revealed && !isJoe && !joeCentered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4 text-center"
        >
          <h3 className="text-white text-2xl md:text-3xl font-serif">{label}</h3>
          <div
            className="mt-3 h-1.5 mx-auto rounded-full"
            style={{
              width: "120px",
              background: accent,
              boxShadow: `0 0 18px ${accent}`,
            }}
          />
        </motion.div>
      )}
    </motion.button>
  );
}

function BoardingPassSequence({
  start,
  onComplete,
}: {
  start: boolean;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!start) return;
    setStep(1);
  }, [start]);

  useEffect(() => {
    if (step === 4) {
      const t = setTimeout(() => {
        onComplete?.();
      }, 900);
      return () => clearTimeout(t);
    }
  }, [step, onComplete]);

  return (
    <div
      className="relative rounded-[28px] overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #fffaf2 0%, #f4e6ce 58%, #ead6b8 100%),
          repeating-linear-gradient(
            0deg,
            rgba(90,60,30,0.025) 0px,
            rgba(90,60,30,0.025) 1px,
            transparent 1px,
            transparent 5px
          )
        `,
        boxShadow: "0 28px 80px rgba(0,0,0,0.45)",
        border: "1px solid rgba(80,40,20,0.12)",
      }}
    >
      <div className="grid md:grid-cols-[1fr_230px]">
        <div className="p-8 md:p-10">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-black/45 font-mono">
            passageiro confirmado
          </p>

          <div className="mt-4 flex items-center justify-between gap-4">
            <h2 className="text-4xl md:text-6xl text-black font-serif">Boarding Pass</h2>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.3em] text-black/35 font-mono">
                air amor
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/35 font-mono">
                special flight
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-7">
            <div className="grid grid-cols-[70px_1fr] md:grid-cols-[90px_1fr] gap-3 items-start">
              <div className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-black/45 font-mono pt-2">
                DE
              </div>
              {step > 1 ? (
                <p
                  className="text-2xl md:text-4xl text-black leading-relaxed italic"
                  style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
                >
                  Porto
                </p>
              ) : (
                <TypeLine
                  text="Porto"
                  start={step === 1}
                  speed={185}
                  onDone={() => setStep(2)}
                  className="text-2xl md:text-4xl text-black leading-relaxed italic"
                  cursorColorClass="text-black/60"
                />
              )}
            </div>

            <div className="grid grid-cols-[70px_1fr] md:grid-cols-[90px_1fr] gap-3 items-start">
              <div className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-black/45 font-mono pt-2">
                PARA
              </div>
              {step > 2 ? (
                <p
                  className="text-2xl md:text-4xl text-black leading-relaxed italic"
                  style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
                >
                  Málaga
                </p>
              ) : (
                <TypeLine
                  text="Málaga"
                  start={step === 2}
                  speed={300}
                  onDone={() => setStep(3)}
                  className="text-2xl md:text-4xl text-black leading-relaxed italic"
                  cursorColorClass="text-black/60"
                />
              )}
            </div>

            <div className="grid grid-cols-[70px_1fr] md:grid-cols-[90px_1fr] gap-3 items-start">
              <div className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-black/45 font-mono pt-2">
                DATA
              </div>
              {step > 3 ? (
                <p
                  className="text-2xl md:text-4xl text-black leading-relaxed italic"
                  style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
                >
                  19–22 Setembro
                </p>
              ) : (
                <TypeLine
                  text="19–22 Setembro"
                  start={step === 3}
                  speed={180}
                  onDone={() => setStep(4)}
                  className="text-2xl md:text-4xl text-black leading-relaxed italic"
                  cursorColorClass="text-black/60"
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-black/10 p-6 md:p-8 flex flex-col justify-between bg-black/[0.035] relative">
          <div>
            {step >= 3 && (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-[10px] uppercase tracking-[0.32em] text-black/40 font-mono"
                >
                  destino
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-3 text-3xl md:text-4xl text-black italic"
                  style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
                >
                  Málaga
                </motion.h3>
              </>
            )}
          </div>

          <div className="mt-8">
            <div className="h-24 md:h-28 rounded-xl bg-black/10 flex items-center justify-center overflow-hidden">
              <div className="flex gap-[3px] opacity-70">
                {Array.from({ length: 26 }).map((_, i) => (
                  <span
                    key={i}
                    className="block bg-black"
                    style={{
                      width: i % 3 === 0 ? "3px" : "1px",
                      height: `${28 + ((i * 7) % 32)}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-5 right-5 text-[10px] uppercase tracking-[0.3em] text-black/35 font-mono">
            gate open
          </div>
        </div>
      </div>

      <div className="absolute top-0 bottom-0 right-[230px] hidden md:flex items-center translate-x-1/2">
        <div className="w-8 h-8 rounded-full bg-[#0b0913]" />
      </div>

      <div
        className="absolute top-0 bottom-0 right-[230px] hidden md:block"
        style={{
          width: "1px",
          borderRight: "2px dashed rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

function FinalSequence({
  start,
  onComplete,
}: {
  start: boolean;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!start) return;
    setStep(1);
  }, [start]);

  useEffect(() => {
    if (step === 5) {
      const t = setTimeout(() => {
        onComplete?.();
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [step, onComplete]);

  return (
    <div className="space-y-5 md:space-y-7">
      <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
        {step > 1 ? (
          <>
            <p className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed">
              Parabéns, meu amor
            </p>
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: [1, 1.12, 1] }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { repeat: Infinity, duration: 1.3 },
              }}
              className="text-4xl md:text-5xl"
            >
              ❤️
            </motion.span>
          </>
        ) : (
          <TypeLine
            text="Parabéns, meu amor"
            start={step === 1}
            speed={140}
            onDone={() => setStep(2)}
            className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed"
          />
        )}
      </div>

      {step >= 2 && (
        <>
          {step > 2 ? (
            <p className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed">
              Espero que tenhas gostado.
            </p>
          ) : (
            <TypeLine
              text="Espero que tenhas gostado."
              start={step === 2}
              speed={140}
              onDone={() => setStep(3)}
              className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed"
            />
          )}
        </>
      )}

      {step >= 3 && (
        <>
          {step > 3 ? (
            <p className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed">
              Amo-te muito.
            </p>
          ) : (
            <TypeLine
              text="Amo-te muito."
              start={step === 3}
              speed={140}
              onDone={() => setStep(4)}
              className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed"
            />
          )}
        </>
      )}

      {step >= 4 && (
        <>
          {step > 4 ? (
            <p className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed">
              (Afinal também sei fazer umas coisas engraçadas com o trabalho).
            </p>
          ) : (
            <TypeLine
              text="(Afinal também sei fazer umas coisas engraçadas com o trabalho)."
              start={step === 4}
              speed={98}
              onDone={() => setStep(5)}
              className="text-xl md:text-3xl lg:text-4xl text-white font-serif text-center leading-relaxed"
            />
          )}
        </>
      )}
    </div>
  );
}

export function MapReveal({ onComplete }: MapRevealProps) {
  const [phase, setPhase] = useState<Phase>("cards");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [joeCentered, setJoeCentered] = useState(false);
  const [lockedFinal, setLockedFinal] = useState(true);
  const [showBoardingPass, setShowBoardingPass] = useState(false);
  const [startFinal, setStartFinal] = useState(false);

  const handleRevealCard = (id: string) => {
    if (revealed.includes(id)) return;

    if (
      id === "joe" &&
      (lockedFinal || !revealed.includes("hatchi") || !revealed.includes("kikinha"))
    ) {
      return;
    }

    const updated = [...revealed, id];
    setRevealed(updated);

    if (updated.includes("hatchi") && updated.includes("kikinha")) {
      setLockedFinal(false);
    }

    if (id === "joe") {
      setJoeCentered(true);
      setShowCelebration(true);

      setTimeout(() => {
        setPhase("boarding-pass");
      }, 1100);

      setTimeout(() => {
        setShowBoardingPass(true);
      }, 1450);
    }
  };

  const handleBoardingComplete = () => {
    setTimeout(() => {
      setPhase("final");
      setStartFinal(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_#1b1024_0%,_#0b0913_45%,_#050507_100%)]">
      {showCelebration && <Confetti />}

      <AnimatePresence mode="wait">
        {phase === "cards" && (
          <motion.section
            key="cards"
            className="absolute inset-0 px-4 md:px-8 py-6 md:py-14 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.98 }}
            transition={{ duration: 0.6 }}
          >
            <div className="min-h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 md:mb-12"
              >
                <p
                  className="uppercase tracking-[0.28em] sm:tracking-[0.38em] text-white/50 text-[10px] sm:text-xs md:text-sm"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  escolhe o teu destino
                </p>
                <h2 className="mt-3 text-white font-serif text-2xl sm:text-3xl md:text-5xl">
                  Qual será o verdadeiro?
                </h2>
              </motion.div>

              <div className="flex-1 flex flex-col xl:flex-row items-center justify-start xl:justify-center gap-6 md:gap-8 xl:gap-10 pb-8">
                <RevealCard
                  image="/hatchi.png"
                  label="Gandra Vegas"
                  revealed={revealed.includes("hatchi")}
                  accent="#f59e0b"
                  delay={0.1}
                  onClick={() => handleRevealCard("hatchi")}
                  joeCentered={joeCentered}
                />

                <RevealCard
                  image="/kikinha.png"
                  label="Moselos Beach"
                  revealed={revealed.includes("kikinha")}
                  accent="#38bdf8"
                  delay={0.2}
                  onClick={() => handleRevealCard("kikinha")}
                  joeCentered={joeCentered}
                />

                <RevealCard
                  image="/joe.png"
                  label="Málaga"
                  revealed={revealed.includes("joe")}
                  accent="#ef4444"
                  delay={0.3}
                  onClick={() => handleRevealCard("joe")}
                  disabled={lockedFinal}
                  isJoe
                  joeCentered={joeCentered}
                />
              </div>

              <div className="min-h-[80px] mt-6 flex items-center justify-center">
                {!revealed.includes("joe") ? (
                  <motion.p
                    key={`hint-${revealed.length}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/60 italic text-center font-serif text-lg md:text-2xl"
                  >
                    {lockedFinal
                      ? "revela primeiro os dois destinos falsos..."
                      : "agora sim. falta descobrir o verdadeiro."}
                  </motion.p>
                ) : null}
              </div>
            </div>
          </motion.section>
        )}

        {phase === "boarding-pass" && (
          <motion.section
            key="boarding-pass"
            className="absolute inset-0 flex items-center justify-center px-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 1.18, opacity: 1 }}
                animate={{
                  scale: showBoardingPass ? 0.78 : 1.18,
                  opacity: showBoardingPass ? 0.18 : 1,
                  y: showBoardingPass ? -18 : 0,
                }}
                transition={{ duration: 0.6 }}
                className="w-[220px] sm:w-[280px] md:w-[360px] lg:w-[420px]"
              >
                <img
                  src="/joe.png"
                  alt="Joe"
                  className="w-full aspect-square object-cover rounded-[26px] shadow-2xl"
                />
              </motion.div>
            </div>

            <AnimatePresence>
              {showBoardingPass && (
                <motion.div
                  key="pass"
                  initial={{ opacity: 0, scale: 0.22, rotate: -10, y: 90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 13, stiffness: 100 }}
                  className="relative z-20 w-full max-w-3xl"
                >
                  <BoardingPassSequence start={showBoardingPass} onComplete={handleBoardingComplete} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {phase === "final" && (
          <motion.section
            key="final"
            className="absolute inset-0 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FloatingMorangos />

            <div className="relative z-10 max-w-4xl w-full flex flex-col items-center justify-center gap-6 md:gap-8">
              <FinalSequence start={startFinal} onComplete={onComplete} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}