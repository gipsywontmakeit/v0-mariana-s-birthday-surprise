"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";

const zPositions = [
  { left: "8%", bottom: "20%", size: "1.2rem", delay: 0, duration: 5 },
  { left: "18%", bottom: "60%", size: "2rem", delay: 0.8, duration: 4.5 },
  { left: "5%", bottom: "75%", size: "1rem", delay: 1.6, duration: 6 },
  { left: "30%", bottom: "15%", size: "2.5rem", delay: 0.3, duration: 4 },
  { left: "42%", bottom: "80%", size: "1.5rem", delay: 1.2, duration: 5.5 },
  { left: "55%", bottom: "30%", size: "1.8rem", delay: 2, duration: 4.8 },
  { left: "65%", bottom: "70%", size: "1rem", delay: 0.5, duration: 5 },
  { left: "72%", bottom: "45%", size: "2.2rem", delay: 1.5, duration: 4.2 },
  { left: "80%", bottom: "20%", size: "1.4rem", delay: 0.9, duration: 5.5 },
  { left: "88%", bottom: "65%", size: "2rem", delay: 2.2, duration: 4 },
  { left: "92%", bottom: "85%", size: "1.2rem", delay: 0.4, duration: 6 },
  { left: "25%", bottom: "90%", size: "1.6rem", delay: 1.8, duration: 4.5 },
];

interface SleepingSceneProps {
  photoSrc: string;
  photoSize?: string;
  speechText?: string;
  wakeLines: string[];
  act2?: boolean;
  onDragComplete: () => void;
  zsFrozen?: boolean;
}

export function SleepingScene({
  photoSrc,
  speechText,
  wakeLines,
  act2 = false,
  onDragComplete,
  zsFrozen = false,
  photoSize,
}: SleepingSceneProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [textStage, setTextStage] = useState(0);
  const dragY = useMotionValue(0);
  const doneRef = useRef(false);

  const dragEnabled = showHint && !isRevealed;

  const duveCoverTop = useTransform(dragY, (v) => {
    const clamped = Math.max(0, Math.min(v, 255));
    return `calc(36% + ${clamped}px)`;
  });

  const photoOpacity = useTransform(dragY, [70, 190], [0, 1]);
  const photoY = useTransform(dragY, [70, 190], [24, 0]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = 800;
    const step = 1600;

    wakeLines.forEach((_, i) => {
      timers.push(setTimeout(() => setTextStage(i + 1), start + i * step));
    });

    timers.push(
      setTimeout(() => {
        setShowHint(true);
      }, start + wakeLines.length * step + 600)
    );

    return () => timers.forEach(clearTimeout);
  }, [wakeLines]);

  const handleDragEnd = () => {
    if (!dragEnabled) {
      animate(dragY, 0, { duration: 0.25, ease: "easeOut" });
      return;
    }

    const currentY = dragY.get();

    if (currentY > 120) {
      animate(dragY, 255, { duration: 0.34, ease: "easeOut" });

      if (!doneRef.current) {
        doneRef.current = true;
        setIsRevealed(true);
        setShowHint(false);
        setTimeout(onDragComplete, 600);
      }
    } else {
      animate(dragY, 0, { duration: 0.42, ease: "easeOut" });
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {!zsFrozen && (
        <div className="absolute inset-0 pointer-events-none">
          {zPositions.map((z, i) => (
            <motion.span
              key={i}
              className="absolute font-serif text-foreground/35 select-none"
              style={{ left: z.left, bottom: z.bottom, fontSize: z.size }}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.75, 0.55, 0],
                y: -380,
                x: i % 2 === 0 ? 30 : -30,
              }}
              transition={{
                duration: z.duration,
                repeat: Infinity,
                delay: z.delay,
                ease: "easeOut",
              }}
            >
              Zzz
            </motion.span>
          ))}
        </div>
      )}

      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none"
        style={{ height: "38%" }}
      >
        <div className="space-y-3 text-center">
          {wakeLines.map((line, i) => (
            <AnimatePresence key={i}>
              {textStage > i && (
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`font-serif ${
                    i === wakeLines.length - 1
                      ? act2
                        ? "text-4xl md:text-6xl text-primary font-bold"
                        : "text-4xl md:text-6xl text-foreground font-bold"
                      : i === 0
                      ? "text-3xl md:text-5xl text-foreground/60"
                      : "text-3xl md:text-5xl text-foreground/80"
                  }`}
                >
                  {line}
                </motion.h2>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 0, top: "38%" }}
      >
        <div
          style={{
            width: "min(720px, 95vw)",
            height: "100%",
            position: "relative",
            perspective: "1200px",
            perspectiveOrigin: "50% 30%",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: "rotateX(18deg)",
              transformOrigin: "center top",
            }}
          >
            <div
              style={{
                width: "min(640px, 88vw)",
                height: "122px",
                position: "relative",
                zIndex: 2,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, #6b4735 0%, #4b2f22 58%, #2b1a12 100%)",
                  borderRadius: "46px 46px 16px 16px / 58px 58px 16px 16px",
                  boxShadow:
                    "0 -12px 28px rgba(0,0,0,0.42), inset 0 2px 0 rgba(255,255,255,0.06), inset 0 -16px 24px rgba(0,0,0,0.18)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "16px 22px 20px 22px",
                  display: "flex",
                  gap: "14px",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      borderRadius: "20px",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.012) 100%)",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                width: "min(640px, 88vw)",
                flex: 1,
                minHeight: "250px",
                maxHeight: "390px",
                position: "relative",
                overflow: "hidden",
                borderLeft: "18px solid #331f15",
                borderRight: "18px solid #331f15",
                background:
                  "linear-gradient(180deg, #eadfce 0%, #dbcab3 45%, #ccb89c 100%)",
                boxShadow:
                  "inset 0 10px 22px rgba(255,255,255,0.10), inset 0 -18px 28px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "1.5%",
                  right: "1.5%",
                  top: "2%",
                  height: "20%",
                  borderRadius: "26px",
                  background:
                    "linear-gradient(180deg, #f3ede2 0%, #dfd1bb 100%)",
                  boxShadow:
                    "0 12px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.55)",
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: "11%",
                  left: "8%",
                  width: "34%",
                  height: "20%",
                  background: "linear-gradient(145deg, #fdfaf4 0%, #e9dfcc 100%)",
                  borderRadius: "28px 24px 22px 22px",
                  transform: "rotate(-10deg)",
                  boxShadow:
                    "0 10px 18px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.7)",
                  zIndex: 3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "11%",
                  right: "8%",
                  width: "34%",
                  height: "20%",
                  background: "linear-gradient(145deg, #fcf8f1 0%, #e5dbc7 100%)",
                  borderRadius: "24px 28px 22px 22px",
                  transform: "rotate(10deg)",
                  boxShadow:
                    "0 10px 18px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.7)",
                  zIndex: 3,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "11%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "61%",
                  height: "48%",
                  background: "rgba(0,0,0,0.085)",
                  borderRadius: "48% 48% 34% 34% / 76% 76% 28% 28%",
                  filter: "blur(5px)",
                  zIndex: 2,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: "28%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "17%",
                  height: "12%",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "50%",
                  filter: "blur(4px)",
                  zIndex: 2,
                }}
              />

              <motion.div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  x: "-50%",
                  width: photoSize ?? "clamp(170px, 30vw, 250px)",
                  opacity: photoOpacity,
                  y: photoY,
                  zIndex: 8,
                  pointerEvents: "none",
                }}
              >
                <img
                  src={photoSrc}
                  alt="Mariana"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    filter: "drop-shadow(0 -12px 24px rgba(0,0,0,0.45))",
                  }}
                />

                <AnimatePresence>
                  {isRevealed && speechText && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.4, type: "spring", damping: 13 }}
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        marginBottom: "8px",
                        background: "white",
                        borderRadius: "12px",
                        padding: "8px 14px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                      }}
                    >
                      <p
                        style={{
                          color: "#111",
                          fontWeight: 700,
                          fontSize: "10px",
                          textAlign: "center",
                          lineHeight: 1.4,
                          fontFamily: "Georgia, serif",
                          maxWidth: "200px",
                          whiteSpace: "normal",
                        }}
                      >
                        {speechText}
                      </p>
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "7px solid transparent",
                          borderRight: "7px solid transparent",
                          borderTop: "8px solid white",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                drag={dragEnabled ? "y" : false}
                dragConstraints={{ top: 0, bottom: 255 }}
                dragElastic={0.03}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: duveCoverTop,
                  zIndex: 10,
                  cursor: dragEnabled ? "grab" : "default",
                  touchAction: dragEnabled ? "none" : "auto",
                }}
                whileDrag={{ cursor: "grabbing" }}
                _dragY={dragY}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, #ddd0bd 0%, #cdbca4 38%, #b59f86 100%)",
                    borderRadius: "42px 42px 0 0 / 54px 54px 0 0",
                    boxShadow:
                      "0 -16px 26px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.20)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-4%",
                      right: "-4%",
                      height: "42px",
                      background:
                        "linear-gradient(180deg, #e7dccb 0%, #d3c2aa 100%)",
                      borderRadius: "44px 44px 18px 18px",
                      boxShadow:
                        "0 4px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.30)",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "18%",
                      right: "18%",
                      top: "18%",
                      bottom: "8%",
                      background:
                        "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 34%, rgba(0,0,0,0.04) 100%)",
                      borderRadius: "44% 44% 32% 32% / 58% 58% 26% 26%",
                      filter: "blur(4px)",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "36%",
                      right: "36%",
                      top: "10%",
                      height: "17%",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "50%",
                      filter: "blur(7px)",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "8%",
                      bottom: "11%",
                      width: "28%",
                      height: "34%",
                      background: "rgba(255,255,255,0.05)",
                      filter: "blur(22px)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "8%",
                      bottom: "14%",
                      width: "26%",
                      height: "30%",
                      background: "rgba(0,0,0,0.05)",
                      filter: "blur(20px)",
                      borderRadius: "50%",
                    }}
                  />

                  {[26, 48, 70, 88].map((pct) => (
                    <div
                      key={pct}
                      style={{
                        position: "absolute",
                        top: `${pct}%`,
                        left: "6%",
                        right: "6%",
                        height: "1px",
                        background: "rgba(80,55,30,0.07)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <AnimatePresence>
                {showHint && !isRevealed && (
                  <motion.div
                    className="pointer-events-none"
                    style={{
                      position: "absolute",
                      top: "41%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 20,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      animate={{ y: [0, 12, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.16)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.22)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
                        }}
                      >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 4V20M12 20L7 15M12 20L17 15"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div
                        style={{
                          background: "rgba(0,0,0,0.32)",
                          color: "rgba(255,255,255,0.94)",
                          padding: "7px 14px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontFamily: "Georgia, serif",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                        }}
                      >
                        puxa o cobertor para baixo
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              style={{
                width: "min(640px, 88vw)",
                height: "30px",
                flexShrink: 0,
                background: "linear-gradient(180deg, #3b2418 0%, #24150f 100%)",
                borderRadius: "0 0 16px 16px",
                boxShadow: "0 12px 26px rgba(0,0,0,0.42)",
                zIndex: 2,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "min(600px, 84vw)",
                marginTop: "2px",
                flexShrink: 0,
              }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "18px",
                    height: "34px",
                    background: "linear-gradient(180deg, #2a1810 0%, #140c07 100%)",
                    borderRadius: "0 0 6px 6px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}