"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

// Hardcoded Z positions spread across the entire screen
const zPositions = [
  { left: "8%",  bottom: "20%", size: "1.2rem", delay: 0,   duration: 5 },
  { left: "18%", bottom: "60%", size: "2rem",   delay: 0.8, duration: 4.5 },
  { left: "5%",  bottom: "75%", size: "1rem",   delay: 1.6, duration: 6 },
  { left: "30%", bottom: "15%", size: "2.5rem", delay: 0.3, duration: 4 },
  { left: "42%", bottom: "80%", size: "1.5rem", delay: 1.2, duration: 5.5 },
  { left: "55%", bottom: "30%", size: "1.8rem", delay: 2,   duration: 4.8 },
  { left: "65%", bottom: "70%", size: "1rem",   delay: 0.5, duration: 5 },
  { left: "72%", bottom: "45%", size: "2.2rem", delay: 1.5, duration: 4.2 },
  { left: "80%", bottom: "20%", size: "1.4rem", delay: 0.9, duration: 5.5 },
  { left: "88%", bottom: "65%", size: "2rem",   delay: 2.2, duration: 4 },
  { left: "92%", bottom: "85%", size: "1.2rem", delay: 0.4, duration: 6 },
  { left: "25%", bottom: "90%", size: "1.6rem", delay: 1.8, duration: 4.5 },
];

export interface SleepingEyesRef {
  openAndClose: () => Promise<void>;
}

interface SleepingEyesProps {
  onTextReady?: () => void;
  wakeStage?: number;
}

export const SleepingEyes = forwardRef<SleepingEyesRef, SleepingEyesProps>(
  function SleepingEyes({ onTextReady, wakeStage = 0 }, ref) {
    const [showContent, setShowContent] = useState(false);
    const [zsFrozen, setZsFrozen] = useState(false);
    const [zsFadingOut, setZsFadingOut] = useState(false);
    const leftEyeControls = useAnimation();
    const rightEyeControls = useAnimation();

    useEffect(() => {
      // Delay before showing eyes
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if (showContent && onTextReady) {
        // Trigger text ready after 3 seconds
        const timer = setTimeout(() => {
          onTextReady();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [showContent, onTextReady]);

    // Handle wakeStage changes for Z animation
    useEffect(() => {
      if (wakeStage >= 1) {
        setZsFrozen(true);
        // Fade out after freezing
        setTimeout(() => {
          setZsFadingOut(true);
        }, 100);
      }
    }, [wakeStage]);

    useImperativeHandle(ref, () => ({
      openAndClose: async () => {
        // Open eyes slightly
        await Promise.all([
          leftEyeControls.start({
            d: "M 10 55 Q 60 35 110 55 Q 60 45 10 55",
            transition: { duration: 0.3 },
          }),
          rightEyeControls.start({
            d: "M 10 55 Q 60 35 110 55 Q 60 45 10 55",
            transition: { duration: 0.3 },
          }),
        ]);
        // Hold briefly
        await new Promise((resolve) => setTimeout(resolve, 200));
        // Slam shut
        await Promise.all([
          leftEyeControls.start({
            d: "M 10 55 Q 60 25 110 55",
            transition: { duration: 0.15, ease: "easeIn" },
          }),
          rightEyeControls.start({
            d: "M 10 55 Q 60 25 110 55",
            transition: { duration: 0.15, ease: "easeIn" },
          }),
        ]);
      },
    }));

    // Calculate Z animation speed multiplier based on wakeStage
    const getSpeedMultiplier = () => {
      if (wakeStage === 0) return 1;
      if (wakeStage === 1) return 2; // Slower (duration * 2)
      if (wakeStage === 2) return 3; // Even slower
      return 1; // Stage 3 is frozen
    };

    // Calculate Z opacity based on wakeStage
    const getZOpacity = () => {
      if (zsFadingOut) return 0;
      if (wakeStage === 2) return 0.3;
      return 1;
    };

    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle warm radial gradient behind eyes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 45%, oklch(0.25 0.03 60 / 0.3) 0%, transparent 70%)",
          }}
        />

        {showContent && (
          <>
            {/* Main eyes container - centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex items-center gap-8 md:gap-16"
              >
                {/* Left Eye */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    width="120"
                    height="80"
                    viewBox="0 0 120 80"
                    className="w-[100px] md:w-[160px] lg:w-[200px] h-auto"
                  >
                    {/* Eyelid line */}
                    <motion.path
                      d="M 10 55 Q 60 25 110 55"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-foreground/80"
                      animate={leftEyeControls}
                    />
                    {/* Lashes */}
                    <motion.g className="text-foreground/50">
                      <path d="M 20 48 L 12 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 35 38 L 30 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 52 32 L 50 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 68 32 L 70 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 85 38 L 90 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 100 48 L 108 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </motion.g>
                  </svg>
                </motion.div>

                {/* Right Eye */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                >
                  <svg
                    width="120"
                    height="80"
                    viewBox="0 0 120 80"
                    className="w-[100px] md:w-[160px] lg:w-[200px] h-auto"
                  >
                    {/* Eyelid line */}
                    <motion.path
                      d="M 10 55 Q 60 25 110 55"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-foreground/80"
                      animate={rightEyeControls}
                    />
                    {/* Lashes */}
                    <motion.g className="text-foreground/50">
                      <path d="M 20 48 L 12 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 35 38 L 30 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 52 32 L 50 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 68 32 L 70 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 85 38 L 90 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 100 48 L 108 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </motion.g>
                  </svg>
                </motion.div>
              </motion.div>
            </div>

            {/* Z's floating across the entire screen - hardcoded positions */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: getZOpacity() }}
              transition={{ duration: zsFadingOut ? 1 : 0.3 }}
            >
              {zPositions.map((z, i) => (
                <motion.span
                  key={i}
                  className="absolute font-serif text-foreground/40 select-none"
                  style={{
                    left: z.left,
                    bottom: z.bottom,
                    fontSize: z.size,
                  }}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={zsFrozen ? {} : {
                    opacity: [0, 0.7, 0.5, 0],
                    y: -400,
                    x: i % 2 === 0 ? 40 : -40,
                    rotate: i % 2 === 0 ? 15 : -15,
                  }}
                  transition={zsFrozen ? {} : {
                    duration: z.duration * getSpeedMultiplier(),
                    repeat: Infinity,
                    delay: z.delay,
                    ease: "easeOut",
                  }}
                >
                  Zzz
                </motion.span>
              ))}
            </motion.div>

            {/* Snoring sound wave below eyes */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[58%] md:top-[55%]">
              <motion.svg
                width="120"
                height="30"
                viewBox="0 0 120 30"
                className="opacity-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.5 }}
              >
                <motion.path
                  d="M 0 15 Q 15 5, 30 15 T 60 15 T 90 15 T 120 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-foreground/60"
                  animate={{
                    d: [
                      "M 0 15 Q 15 5, 30 15 T 60 15 T 90 15 T 120 15",
                      "M 0 15 Q 15 25, 30 15 T 60 15 T 90 15 T 120 15",
                      "M 0 15 Q 15 5, 30 15 T 60 15 T 90 15 T 120 15",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>
            </div>
          </>
        )}
      </div>
    );
  }
);
