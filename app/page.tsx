"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SnoringAnimation } from "@/components/snoring-animation";
import { ClockAnimation } from "@/components/clock-animation";
import { EvidenceBoard } from "@/components/evidence-board";
import { Typewriter } from "@/components/typewriter";
import { PlaneAnimation } from "@/components/plane-animation";
import { Confetti } from "@/components/confetti";
import { Button } from "@/components/ui/button";

type Screen = 
  | "wake-act1" 
  | "wake-sleep-again" 
  | "wake-act2" 
  | "investigation" 
  | "proverbio" 
  | "tease" 
  | "reveal";

export default function BirthdaySurprise() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("wake-act1");
  const [wakeTextStage, setWakeTextStage] = useState(0);
  const [showWakeButton, setShowWakeButton] = useState(false);
  const [showPlane, setShowPlane] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealStage, setRevealStage] = useState(0);

  // Wake-up Act 1 text sequence
  useEffect(() => {
    if (currentScreen !== "wake-act1") return;
    
    const timings = [1500, 3000, 4500, 5500];
    timings.forEach((time, index) => {
      setTimeout(() => {
        if (index < 3) {
          setWakeTextStage(index + 1);
        } else {
          setShowWakeButton(true);
        }
      }, time);
    });
  }, [currentScreen]);

  // Wake-up Act 2 text sequence
  useEffect(() => {
    if (currentScreen !== "wake-act2") return;
    
    setWakeTextStage(0);
    setShowWakeButton(false);
    
    const timings = [1000, 2500, 4000, 5000];
    timings.forEach((time, index) => {
      setTimeout(() => {
        if (index < 3) {
          setWakeTextStage(index + 1);
        } else {
          setShowWakeButton(true);
        }
      }, time);
    });
  }, [currentScreen]);

  // Auto-advance from proverbio
  useEffect(() => {
    if (currentScreen !== "proverbio") return;
    
    const timer = setTimeout(() => {
      setCurrentScreen("tease");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentScreen]);

  // Reveal sequence
  useEffect(() => {
    if (currentScreen !== "reveal") return;
    
    setShowConfetti(true);
    
    const timings = [500, 1500, 2500, 3500];
    timings.forEach((time, index) => {
      setTimeout(() => {
        setRevealStage(index + 1);
      }, time);
    });
  }, [currentScreen]);

  const handleFirstWake = () => {
    setCurrentScreen("wake-sleep-again");
    setWakeTextStage(0);
    setShowWakeButton(false);
    
    // After clock animation, go to act 2
    setTimeout(() => {
      setCurrentScreen("wake-act2");
    }, 3500);
  };

  const handleSecondWake = () => {
    setCurrentScreen("investigation");
  };

  const handleInvestigationContinue = () => {
    setCurrentScreen("proverbio");
  };

  const handleTeaseComplete = () => {
    setShowPlane(true);
  };

  const handlePlaneComplete = () => {
    setShowFinalButton(true);
  };

  const handleFinalButton = () => {
    setCurrentScreen("reveal");
  };

  const handleProverbioClick = () => {
    setCurrentScreen("tease");
  };

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Screen 1 - Wake-up Act 1 */}
        {currentScreen === "wake-act1" && (
          <motion.section
            key="wake-act1"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-12">
              <SnoringAnimation />
            </div>
            
            <div className="space-y-4 text-center">
              <AnimatePresence>
                {wakeTextStage >= 1 && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-3xl md:text-5xl text-foreground/70"
                  >
                    Mariana.
                  </motion.h2>
                )}
                {wakeTextStage >= 2 && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-3xl md:text-5xl text-foreground/85"
                  >
                    Mariana.
                  </motion.h2>
                )}
                {wakeTextStage >= 3 && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-6xl text-foreground font-bold"
                  >
                    MARIANA.
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>
            
            {showWakeButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <Button
                  onClick={handleFirstWake}
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
                >
                  Ok ok, já acordei
                </Button>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Screen 1 - Sleep Again (Clock Animation) */}
        {currentScreen === "wake-sleep-again" && (
          <motion.section
            key="wake-sleep-again"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SnoringAnimation />
            <div className="mt-12">
              <ClockAnimation />
            </div>
          </motion.section>
        )}

        {/* Screen 1 - Wake-up Act 2 */}
        {currentScreen === "wake-act2" && (
          <motion.section
            key="wake-act2"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-12">
              <SnoringAnimation />
            </div>
            
            <div className="space-y-4 text-center">
              <AnimatePresence>
                {wakeTextStage >= 1 && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-3xl md:text-5xl text-foreground/70"
                  >
                    Mariana.
                  </motion.h2>
                )}
                {wakeTextStage >= 2 && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-6xl text-foreground font-bold"
                  >
                    MARIANA.
                  </motion.h2>
                )}
                {wakeTextStage >= 3 && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-6xl text-primary font-bold"
                  >
                    MARIANA, A SÉRIO.
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>
            
            {showWakeButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 flex flex-col items-center gap-3"
              >
                <Button
                  onClick={handleSecondWake}
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
                >
                  Ok, agora acordei mesmo
                </Button>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-muted-foreground italic"
                >
                  (desta vez a culpa não é da medicação)
                </motion.p>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Screen 2 - Investigation */}
        {currentScreen === "investigation" && (
          <motion.section
            key="investigation"
            className="fixed inset-0 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-2xl md:text-4xl text-foreground mb-8 text-center"
            >
              Passámos a noite a investigar.
            </motion.h2>
            
            <EvidenceBoard />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 }}
              className="mt-8"
            >
              <Button
                onClick={handleInvestigationContinue}
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
              >
                Ok, e então?
              </Button>
            </motion.div>
          </motion.section>
        )}

        {/* Screen 3 - Proverbio */}
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
              <p className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground italic leading-tight">
                {'"'}Quem dorme não apanha peixes.{'"'}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-8 text-xl md:text-2xl text-primary font-medium"
              >
                Mas desta vez apanhaste.
              </motion.p>
            </motion.blockquote>
          </motion.section>
        )}

        {/* Screen 4 - Tease */}
        {currentScreen === "tease" && (
          <motion.section
            key="tease"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-xl w-full text-center">
              <Typewriter
                lines={[
                  "Fiz uma coisa.",
                  "Uma coisa que vai precisar de mala.",
                  "E protetor solar.",
                  "E de acordares cedo.",
                ]}
                onComplete={handleTeaseComplete}
                className="mb-12"
              />
              
              {showPlane && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <PlaneAnimation onComplete={handlePlaneComplete} />
                </motion.div>
              )}
              
              {showFinalButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Button
                    onClick={handleFinalButton}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-xl font-medium"
                  >
                    Okaaaaaaaaaaaaaaay, letz go
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* Screen 5 - Reveal */}
        {currentScreen === "reveal" && (
          <motion.section
            key="reveal"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {showConfetti && <Confetti />}
            
            <div className="text-center max-w-3xl">
              {revealStage >= 1 && (
                <motion.h1
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="font-serif text-7xl md:text-9xl lg:text-[12rem] font-bold text-primary tracking-tight"
                >
                  MÁLAGA
                </motion.h1>
              )}
              
              {revealStage >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-2xl md:text-3xl text-foreground/80 font-serif"
                >
                  19 a 22 de Setembro
                </motion.p>
              )}
              
              {revealStage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 mx-auto"
                >
                  <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-primary/30">
                    {/* Photo placeholder */}
                    <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                          <span className="text-2xl text-muted-foreground/50">+</span>
                        </div>
                        <p className="text-xs text-muted-foreground/50 italic">
                          adiciona foto aqui
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {revealStage >= 4 && (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="mt-12 text-xl md:text-2xl text-foreground font-serif"
                >
                  Feliz aniversário, Mariana.
                  <br />
                  <span className="text-primary">Agora vai fazer a mala.</span>
                </motion.p>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
