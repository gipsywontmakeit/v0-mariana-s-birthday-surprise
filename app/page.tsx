"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SleepingEyes, SleepingEyesRef } from "@/components/sleeping-eyes";
import { EvidenceBoard } from "@/components/evidence-board";
import { Typewriter } from "@/components/typewriter";
import { PlaneAnimation } from "@/components/plane-animation";
import { Confetti } from "@/components/confetti";
import { Narrator } from "@/components/narrator";
import { DecryptionReveal } from "@/components/decryption-reveal";
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
  | "reveal-decrypting"
  | "reveal-final";

export default function BirthdaySurprise() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("wake-act1");
  const [wakeTextStage, setWakeTextStage] = useState(0);
  const [showWakeButton, setShowWakeButton] = useState(false);
  const [showWakeText, setShowWakeText] = useState(false);
  const eyesRef = useRef<SleepingEyesRef>(null);
  const eyesRef2 = useRef<SleepingEyesRef>(null);
  const [showPlane, setShowPlane] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealStage, setRevealStage] = useState(0);
  const [showInvestigationButton, setShowInvestigationButton] = useState(false);

  // Wake-up Act 1 text sequence (triggered by SleepingEyes after 3 seconds)
  const handleTextReadyAct1 = () => {
    setShowWakeText(true);
    const timings = [0, 1500, 3000, 4000];
    timings.forEach((time, index) => {
      setTimeout(() => {
        if (index < 3) {
          setWakeTextStage(index + 1);
        } else {
          setShowWakeButton(true);
        }
      }, time);
    });
  };

  // Wake-up Act 2 text sequence (triggered by SleepingEyes after 3 seconds)
  const handleTextReadyAct2 = () => {
    setShowWakeText(true);
    const timings = [0, 1500, 3000, 4000];
    timings.forEach((time, index) => {
      setTimeout(() => {
        if (index < 3) {
          setWakeTextStage(index + 1);
        } else {
          setShowWakeButton(true);
        }
      }, time);
    });
  };
  
  // Reset state when entering act 2
  useEffect(() => {
    if (currentScreen === "wake-act2") {
      setWakeTextStage(0);
      setShowWakeButton(false);
      setShowWakeText(false);
    }
  }, [currentScreen]);

  // Auto-advance from proverbio
  useEffect(() => {
    if (currentScreen !== "proverbio") return;
    
    const timer = setTimeout(() => {
      setCurrentScreen("tease");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentScreen]);

  // Reveal final sequence
  useEffect(() => {
    if (currentScreen !== "reveal-final") return;
    
    const timings = [800, 2000, 3200, 4500];
    timings.forEach((time, index) => {
      setTimeout(() => {
        setRevealStage(index + 1);
        if (index === 0) {
          setShowConfetti(true);
        }
      }, time);
    });
  }, [currentScreen]);

  const handleFirstWake = async () => {
    // Eyes open slightly then slam shut
    if (eyesRef.current) {
      await eyesRef.current.openAndClose();
    }
    
    setWakeTextStage(0);
    setShowWakeButton(false);
    setShowWakeText(false);
    setCurrentScreen("fade-to-black");
    
    // Fade to black, then show "2 horas depois..."
    setTimeout(() => {
      setCurrentScreen("two-hours-later");
    }, 800);
  };

  const handleSecondWake = () => {
    setCurrentScreen("investigation");
  };

  const handleInvestigationComplete = () => {
    setShowInvestigationButton(true);
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
    setCurrentScreen("reveal-question");
  };

  const handleProverbioClick = () => {
    setCurrentScreen("tease");
  };

  const handleStartDecryption = () => {
    setCurrentScreen("reveal-decrypting");
  };

  const handleDecryptionComplete = () => {
    setTimeout(() => {
      setCurrentScreen("reveal-final");
    }, 500);
  };

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Screen 1 - Wake-up Act 1 */}
        {currentScreen === "wake-act1" && (
          <motion.section
            key="wake-act1"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SleepingEyes ref={eyesRef} onTextReady={handleTextReadyAct1} />
            
            {/* Text appears BELOW the eyes after 3 seconds */}
            <AnimatePresence>
              {showWakeText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-end pb-[20vh] pointer-events-none"
                >
                  <Narrator text="Era uma vez uma rapariga que dormia muito..." />
                  
                  <div className="space-y-4 text-center pointer-events-auto">
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
                      className="mt-8 pointer-events-auto"
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Fade to black */}
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

        {/* "2 horas depois..." title card */}
        {currentScreen === "two-hours-later" && (
          <motion.section
            key="two-hours-later"
            className="fixed inset-0 flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
              onAnimationComplete={() => setCurrentScreen("wake-act2")}
              className="font-serif text-2xl md:text-4xl text-foreground/80 italic"
            >
              2 horas depois...
            </motion.p>
          </motion.section>
        )}

        {/* Screen 1 - Wake-up Act 2 */}
        {currentScreen === "wake-act2" && (
          <motion.section
            key="wake-act2"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SleepingEyes ref={eyesRef2} onTextReady={handleTextReadyAct2} />
            
            {/* Text appears BELOW the eyes after 3 seconds */}
            <AnimatePresence>
              {showWakeText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-end pb-[20vh] pointer-events-none"
                >
                  <div className="space-y-4 text-center pointer-events-auto">
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
                      className="mt-8 flex flex-col items-center gap-3 pointer-events-auto"
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Screen 2 - Investigation */}
        {currentScreen === "investigation" && (
          <motion.section
            key="investigation"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Full-screen evidence board */}
            <EvidenceBoard onAllRevealed={handleInvestigationComplete} />
            
            {/* Title overlay */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 left-0 right-0 font-serif text-xl md:text-3xl text-foreground/90 text-center z-30 px-4"
            >
              Passámos a noite a investigar.
            </motion.h2>
            
            {/* Continue button */}
            <AnimatePresence>
              {showInvestigationButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-8 left-0 right-0 flex justify-center z-30"
                >
                  <Button
                    onClick={handleInvestigationContinue}
                    variant="outline"
                    className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-6 text-lg bg-background/80 backdrop-blur-sm"
                  >
                    Ok, e então?
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
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
            <Narrator text="Mas o universo tinha outros planos." />
            
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
            <Narrator text="Alguém tinha estado muito ocupado." />
            
            <div className="max-w-xl w-full text-center mt-8">
              <Typewriter
                lines={[
                  "Fiz uma coisa.",
                  "Uma coisa que vai precisar de mala.",
                  "E protetor solar.",
                  "E de acordares cedo.",
                ]}
                onComplete={handleTeaseComplete}
                typingSpeed={70}
                lineDelay={1000}
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

        {/* Screen 5 - Reveal: Question */}
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
              className="font-serif text-3xl md:text-5xl text-foreground text-center mb-12"
            >
              Então, para onde vamos?
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <Button
                onClick={handleStartDecryption}
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
              >
                Descobrir destino
              </Button>
            </motion.div>
          </motion.section>
        )}

        {/* Screen 5 - Reveal: Decrypting */}
        {currentScreen === "reveal-decrypting" && (
          <motion.section
            key="reveal-decrypting"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground text-sm mb-4 tracking-widest uppercase">
              A desencriptar destino...
            </p>
            
            <div className="text-5xl md:text-7xl font-bold">
              <DecryptionReveal 
                targetText="MÁLAGA" 
                onComplete={handleDecryptionComplete}
              />
            </div>
            
            {/* Progress bar */}
            <motion.div
              className="mt-8 w-64 h-1 bg-secondary rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear" }}
              />
            </motion.div>
          </motion.section>
        )}

        {/* Screen 5 - Reveal: Final */}
        {currentScreen === "reveal-final" && (
          <motion.section
            key="reveal-final"
            className="fixed inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Narrator text="Fim. Ou melhor — início." delay={3} />
            
            {showConfetti && <Confetti />}
            
            <div className="text-center max-w-3xl">
              {revealStage >= 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [0.3, 1.1, 1],
                    x: [0, -5, 5, -5, 5, 0],
                  }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.6, 1],
                    x: { delay: 0.3, duration: 0.3 }
                  }}
                >
                  <h1 className="font-serif text-7xl md:text-9xl lg:text-[12rem] font-bold text-primary tracking-tight">
                    MÁLAGA
                  </h1>
                </motion.div>
              )}
              
              {revealStage >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <Typewriter
                    lines={["19 a 22 de Setembro"]}
                    typingSpeed={100}
                    className="text-2xl md:text-3xl text-foreground/80 font-serif"
                  />
                </motion.div>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12"
                >
                  <Typewriter
                    lines={[
                      "Feliz aniversário, Mariana.",
                      "Agora vai fazer a mala."
                    ]}
                    typingSpeed={60}
                    lineDelay={800}
                    className="text-xl md:text-2xl text-foreground font-serif"
                  />
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
