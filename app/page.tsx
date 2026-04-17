"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SleepingScene } from "@/components/sleeping-scene";
import { EvidenceBoard } from "@/components/evidence-board";
import { Typewriter } from "@/components/typewriter";
import { PlaneAnimation } from "@/components/plane-animation";
import { MapReveal } from "@/components/map-reveal";
import { Button } from "@/components/ui/button";

type Screen =
  | "wake-act1"
  | "fade-to-black"
  | "two-hours-later"
  | "wake-act2"
  | "investigation"
  | "proverbio"
  | "tease"
  | "reveal-question"
  | "reveal-map";

export default function BirthdaySurprise() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("wake-act1");
  const [act1DragDone, setAct1DragDone] = useState(false);
  const [act2DragDone, setAct2DragDone] = useState(false);
  const [showSecondWakeButton, setShowSecondWakeButton] = useState(false);
  const [showPlane, setShowPlane] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [showInvestigationButton, setShowInvestigationButton] = useState(false);

  const handleAct1DragComplete = () => {
    setAct1DragDone(true);
    setTimeout(() => {
      setCurrentScreen("fade-to-black");
      setTimeout(() => setCurrentScreen("two-hours-later"), 800);
    }, 1200);
  };

  const handleAct2DragComplete = () => {
    setAct2DragDone(true);
    setTimeout(() => setShowSecondWakeButton(true), 1800);
  };

  useEffect(() => {
    if (currentScreen === "wake-act2") {
      setAct2DragDone(false);
      setShowSecondWakeButton(false);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen !== "proverbio") return;
    const timer = setTimeout(() => setCurrentScreen("tease"), 5000);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  const handleSecondWake = () => setCurrentScreen("investigation");
  const handleInvestigationComplete = () => setShowInvestigationButton(true);
  const handleInvestigationContinue = () => setCurrentScreen("proverbio");
  const handleTeaseComplete = () => setShowPlane(true);
  const handlePlaneComplete = () => setShowFinalButton(true);
  const handleFinalButton = () => setCurrentScreen("reveal-question");
  const handleProverbioClick = () => setCurrentScreen("tease");
  const handleStartReveal = () => setCurrentScreen("reveal-map");

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === "wake-act1" && (
          <motion.section
            key="wake-act1"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SleepingScene
              photoSrc="/bom_dia.png"
              wakeLines={["Mariana.", "Mariana.", "MARIANA."]}
              onDragComplete={handleAct1DragComplete}
              zsFrozen={act1DragDone}
            />
          </motion.section>
        )}

        {currentScreen === "fade-to-black" && (
          <motion.section
            key="fade-to-black"
            className="fixed inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {currentScreen === "two-hours-later" && (
          <motion.section
            key="two-hours-later"
            className="fixed inset-0 flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typewriter
              lines={["2 horas depois..."]}
              typingSpeed={80}
              lineDelay={1200}
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground/80 italic text-center"
              onComplete={() => setTimeout(() => setCurrentScreen("wake-act2"), 800)}
            />
          </motion.section>
        )}

        {currentScreen === "wake-act2" && (
          <motion.section
            key="wake-act2"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SleepingScene
              photoSrc="/ja_acordei.png"
              photoSize="clamp(180px, 35vw, 240px)"
              speechText="JÁ ESTOU ACORDADA QUE QUERES"
              wakeLines={["Mariana.", "MARIANA.", "MARIANA, A SÉRIO."]}
              act2={true}
              onDragComplete={handleAct2DragComplete}
              zsFrozen={act2DragDone}
            />

            <AnimatePresence>
              {showSecondWakeButton && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-3 sm:right-6 md:right-10 z-30"
                >
                  <motion.button
                    onClick={handleSecondWake}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative flex flex-col items-center"
                  >
                    <div
                      style={{
                        background: "white",
                        borderRadius: "22px",
                        padding: "10px 14px",
                        marginBottom: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
                        position: "relative",
                        maxWidth: "220px",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <p
                        style={{
                          color: "#111",
                          fontWeight: 700,
                          fontSize: "13px",
                          textAlign: "center",
                          lineHeight: 1.35,
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        CLICA EM MIM RÁPIDO PARA NÃO ME PASSAR JÁ
                      </p>

                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "10px solid transparent",
                          borderRight: "10px solid transparent",
                          borderTop: "14px solid white",
                        }}
                      />
                    </div>

                    <img
                      src="/nervos.png"
                      alt="Mariana nervosa"
                      className="w-28 sm:w-36 md:w-48 lg:w-56 h-auto object-contain"
                      style={{
                        filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.4))",
                      }}
                    />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {currentScreen === "investigation" && (
          <motion.section
            key="investigation"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <EvidenceBoard onAllRevealed={handleInvestigationComplete} />
            <AnimatePresence>
              {showInvestigationButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center z-30"
                >
                  <Button
                    onClick={handleInvestigationContinue}
                    variant="outline"
                    className="border-primary/50 text-foreground hover:bg-primary/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-background/80 backdrop-blur-sm"
                  >
                    Ok, e então?
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {currentScreen === "proverbio" && (
          <motion.section
            key="proverbio"
            className="fixed inset-0 flex flex-col items-center justify-center px-6 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={handleProverbioClick}
          >
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-center max-w-2xl"
            >
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground italic leading-tight">
                {'"'}Quem dorme não apanha peixes.{'"'}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-8 text-lg sm:text-xl md:text-2xl text-primary font-medium"
              >
                Mas desta vez apanhaste.
              </motion.p>
            </motion.blockquote>
          </motion.section>
        )}

        {currentScreen === "tease" && (
          <motion.section
            key="tease"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-xl w-full text-center flex flex-col items-center">
              <div className="min-h-[260px] sm:min-h-[300px] w-full">
                <Typewriter
                  lines={[
                    "Fiz uma coisa.",
                    "Uma coisa… que ainda não sabes.",
                    "Mas vais descobrir.",
                    "E vais gostar.",
                    "Muito.",
                    "Só que há um problema.",
                    "Não dá para fazer de pijama.",
                    "Nem deitada no sofá.",
                    "Vai precisar de energia.",
                    "E talvez… um bocadinho de descanso.",
                    "Ah…",
                    "E também vais precisar de mala.",
                    "E protetor solar.",
                    "E de acordares cedo.",
                  ]}
                  onComplete={handleTeaseComplete}
                  typingSpeed={70}
                  lineDelay={1000}
                  className="mb-12"
                />
              </div>

              {showPlane && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 sm:mt-8">
                  <PlaneAnimation onComplete={handlePlaneComplete} />
                </motion.div>
              )}

              {showFinalButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 sm:mt-8"
                >
                  <Button
                    onClick={handleFinalButton}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 sm:px-10 py-6 sm:py-7 text-lg sm:text-xl font-medium"
                  >
                    Okaaaaaaaaaaaaaaay, letz go
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {currentScreen === "reveal-question" && (
          <motion.section
            key="reveal-question"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground text-center mb-12"
            >
              Então, para onde vamos?
            </motion.h2>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring", damping: 14 }}
              whileHover={{ scale: 1.06, y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartReveal}
              className="flex flex-col items-center gap-4"
            >
              <motion.img
                src="/cadela.jpeg"
                alt="Descobrir destino"
                className="w-64 md:w-80 lg:w-[22rem] h-auto object-contain"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                style={{
                  filter: `
                    drop-shadow(0 0 0 white)
                    drop-shadow(0 0 8px white)
                    drop-shadow(0 0 16px white)
                    drop-shadow(0 10px 25px rgba(0,0,0,0.45))
                  `,
                }}
              />

              <span
                className="text-white font-serif text-xl md:text-2xl drop-shadow-lg"
                style={{ textShadow: "0 0 12px rgba(255,255,255,0.35)" }}
              >
                Descobrir destino
              </span>
            </motion.button>
          </motion.section>
        )}

        {currentScreen === "reveal-map" && (
          <motion.section
            key="reveal-map"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapReveal />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}