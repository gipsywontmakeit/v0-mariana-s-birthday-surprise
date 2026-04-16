"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";
import { Confetti } from "@/components/confetti";

const europePaths = {
  portugal: "M 95 145 L 90 150 L 88 165 L 92 180 L 98 185 L 102 175 L 100 160 L 95 145",
  spain: "M 98 185 L 102 175 L 100 160 L 95 145 L 115 140 L 145 145 L 165 155 L 175 170 L 165 185 L 140 195 L 110 195 L 98 185",
  france: "M 165 155 L 175 130 L 200 115 L 230 120 L 240 145 L 235 165 L 210 175 L 175 170 L 165 155",
  italy: "M 240 145 L 260 155 L 275 185 L 265 210 L 250 220 L 260 195 L 255 175 L 245 160 L 240 145",
  uk: "M 155 95 L 165 85 L 175 90 L 180 105 L 170 120 L 160 115 L 155 100 L 155 95",
  germany: "M 230 120 L 250 110 L 270 115 L 275 135 L 260 150 L 240 145 L 230 120",
  coast: "M 165 185 L 190 190 L 220 195 L 245 200 L 260 195",
};

const malagaPos = { x: 135, y: 188 };
const portugalPos = { x: 92, y: 165 };

// Polaroid photos — drops in one by one
const photos = [
  {
    src: "/malaga-1.jpg",
    emoji: "🏖️",
    caption: "praia da Malagueta",
    bg: "linear-gradient(160deg, #74b9ff 0%, #0984e3 100%)",
    angle: -6,
    delay: 0,
  },
  {
    src: "/malaga-2.jpg",
    emoji: "🌅",
    caption: "pôr do sol no porto",
    bg: "linear-gradient(160deg, #ffeaa7 0%, #e17055 100%)",
    angle: 4,
    delay: 0.3,
  },
  {
    src: "/malaga-3.jpg",
    emoji: "🍷",
    caption: "tapas & vinho",
    bg: "linear-gradient(160deg, #fab1a0 0%, #8B2635 100%)",
    angle: -3,
    delay: 0.6,
  },
  {
    src: "/malaga-4.jpg",
    emoji: "🏛️",
    caption: "centro histórico",
    bg: "linear-gradient(160deg, #ffd89b 0%, #c9a84c 100%)",
    angle: 7,
    delay: 0.9,
  },
];

interface MapRevealProps {
  onComplete?: () => void;
}

export function MapReveal({ onComplete }: MapRevealProps) {
  const [stage, setStage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [planeProgress, setPlaneProgress] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [typedDates, setTypedDates] = useState("");
  const [datesComplete, setDatesComplete] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");

  const progress = useMotionValue(0);
  const planeX = useTransform(progress, [0, 1], [portugalPos.x, malagaPos.x]);
  const planeY = useTransform(progress, [0, 1], [portugalPos.y - 20, malagaPos.y - 15]);

  // Initial stage timers
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);   // map in
    const t2 = setTimeout(() => setStage(2), 2200);  // plane flies
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Fly the plane
  useEffect(() => {
    if (stage !== 2) return;
    animate(progress, 1, {
      duration: 2.8,
      ease: "easeInOut",
      onUpdate: (v) => setPlaneProgress(v),
      onComplete: () => {
        setShowStars(true);
        setTimeout(() => {
          setStage(3);
          setTimeout(() => {
            setStage(4); // MÁLAGA appears, map fades
            setShowConfetti(true);
          }, 900);
        }, 700);
      },
    });
  }, [stage, progress]);

  // Type dates once stage 4 hits
  useEffect(() => {
    if (stage < 4) return;
    const delay = setTimeout(() => {
      const str = "19 a 22 de Setembro";
      let i = 0;
      const t = setInterval(() => {
        if (i <= str.length) {
          setTypedDates(str.slice(0, i));
          i++;
        } else {
          clearInterval(t);
          setDatesComplete(true);
          setTimeout(() => setStage(5), 600); // photos
        }
      }, 80);
      return () => clearInterval(t);
    }, 1000);
    return () => clearTimeout(delay);
  }, [stage]);

  // Cadela then message
  useEffect(() => {
    if (stage !== 5) return;
    setTimeout(() => setStage(6), 2000);  // cadela
    setTimeout(() => setStage(7), 3500);  // message
  }, [stage]);

  // Type message
  useEffect(() => {
    if (stage < 7) return;
    const str = "Feliz aniversário, Mariana. Agora vai fazer a mala.";
    let i = 0;
    const t = setInterval(() => {
      if (i <= str.length) {
        setTypedMessage(str.slice(0, i));
        i++;
      } else {
        clearInterval(t);
        setTimeout(() => onComplete?.(), 2000);
      }
    }, 50);
    return () => clearInterval(t);
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {showConfetti && <Confetti />}

      {/* ── MAP ── fades out as stage reaches 4 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: stage >= 4 ? 0 : stage >= 1 ? 1 : 0,
          scale: stage === 3 ? 1.06 : 1,
        }}
        transition={{ duration: stage >= 4 ? 0.9 : 1 }}
        style={{ pointerEvents: "none" }}
      >
        <svg
          viewBox="0 0 350 280"
          className="w-full max-w-2xl h-auto px-8"
          style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.35))" }}
        >
          <rect x="0" y="0" width="350" height="280" fill="oklch(0.15 0.02 250)" rx="8" />

          {/* Country outlines */}
          {[
            { d: europePaths.uk,      delay: 0.2 },
            { d: europePaths.france,  delay: 0.3 },
            { d: europePaths.germany, delay: 0.4 },
            { d: europePaths.italy,   delay: 0.5 },
            { d: europePaths.spain,   delay: 0.1 },
          ].map((p, i) => (
            <motion.path
              key={i}
              d={p.d}
              fill="none"
              stroke="oklch(0.4 0.02 250)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 1.2, delay: p.delay }}
            />
          ))}

          {/* Portugal highlighted */}
          <motion.path
            d={europePaths.portugal}
            fill="oklch(0.65 0.15 65 / 0.4)"
            stroke="oklch(0.75 0.12 65)"
            strokeWidth="2"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: stage >= 1 ? 1 : 0, fillOpacity: stage >= 1 ? 0.4 : 0 }}
            transition={{ duration: 1.4 }}
          />

          <motion.path
            d={europePaths.coast}
            fill="none"
            stroke="oklch(0.35 0.02 250)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          />

          {/* Málaga pin */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: stage >= 1 ? 1 : 0, opacity: stage >= 1 ? 1 : 0 }}
            style={{ transformOrigin: `${malagaPos.x}px ${malagaPos.y}px` }}
            transition={{ delay: 0.9, type: "spring", damping: 10 }}
          >
            <ellipse cx={malagaPos.x} cy={malagaPos.y + 3} rx="4" ry="2" fill="rgba(0,0,0,0.3)" />
            <path
              d={`M ${malagaPos.x} ${malagaPos.y - 15} c -8 0 -12 6 -12 12 c 0 8 12 18 12 18 c 0 0 12 -10 12 -18 c 0 -6 -4 -12 -12 -12 z`}
              fill="#c41e3a"
              stroke="#8b1425"
              strokeWidth="1"
            />
            <circle cx={malagaPos.x} cy={malagaPos.y - 10} r="4" fill="white" opacity="0.8" />
          </motion.g>

          {/* Flight path trail */}
          {stage >= 2 && (
            <motion.path
              d={`M ${portugalPos.x} ${portugalPos.y - 20} Q ${(portugalPos.x + malagaPos.x) / 2} ${(portugalPos.y + malagaPos.y) / 2 - 55} ${malagaPos.x} ${malagaPos.y - 15}`}
              fill="none"
              stroke="oklch(0.75 0.12 65)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: planeProgress }}
            />
          )}

          {/* Paper plane */}
          {stage >= 2 && (
            <motion.g style={{ x: planeX, y: planeY }}>
              <motion.g
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {/* Nice paper plane shape */}
                <path d="M 0 -7 L 14 0 L 0 7 L 3 0 Z" fill="white" stroke="rgba(180,180,180,0.4)" strokeWidth="0.5" />
                <path d="M 3 0 L 0 7 L -1 3 Z" fill="rgba(200,200,200,0.25)" />
                <line x1="3" y1="0" x2="-4" y2="0" stroke="rgba(180,180,180,0.3)" strokeWidth="0.5" />
              </motion.g>
            </motion.g>
          )}

          {/* Stars burst at Málaga */}
          {showStars &&
            [...Array(10)].map((_, i) => (
              <motion.text
                key={i}
                x={malagaPos.x}
                y={malagaPos.y - 10}
                fontSize="9"
                fill="oklch(0.82 0.15 65)"
                textAnchor="middle"
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  x: Math.cos((i * Math.PI * 2) / 10) * 35,
                  y: Math.sin((i * Math.PI * 2) / 10) * 35,
                }}
                transition={{ duration: 0.9 }}
              >
                ✦
              </motion.text>
            ))}
        </svg>
      </motion.div>

      {/* ── MÁLAGA REVEAL ── stage 4+ */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-start overflow-hidden"
        style={{ paddingTop: "10vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 4 ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* MÁLAGA title — stamps in */}
        <motion.h1
          className="font-serif font-bold text-primary tracking-tight leading-none select-none"
          style={{ fontSize: "clamp(4rem, 16vw, 10rem)" }}
          initial={{ scale: 0.2, opacity: 0, y: 30 }}
          animate={{
            scale: stage >= 4 ? [0.2, 1.12, 1] : 0.2,
            opacity: stage >= 4 ? 1 : 0,
            y: stage >= 4 ? 0 : 30,
          }}
          transition={{ duration: 0.55, times: [0, 0.7, 1], type: "tween" }}
        >
          MÁLAGA
        </motion.h1>

        {/* Underline */}
        <motion.div
          className="bg-primary/40 rounded-full mt-1"
          style={{ height: "3px" }}
          initial={{ width: 0 }}
          animate={{ width: stage >= 4 ? "min(60vw, 500px)" : 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        {/* Dates */}
        <motion.p
          className="mt-3 font-serif text-foreground/70 text-center"
          style={{ fontSize: "clamp(1.1rem, 2.8vw, 1.8rem)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 4 ? 1 : 0 }}
          transition={{ delay: 0.7 }}
        >
          {typedDates}
          {!datesComplete && <span className="animate-pulse">|</span>}
        </motion.p>

        {/* Polaroid photos — tumble in */}
        {stage >= 5 && (
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 px-4 max-w-2xl">
            {photos.map((photo) => (
              <motion.div
                key={photo.caption}
                initial={{ opacity: 0, y: -140, rotate: photo.angle - 12, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, rotate: photo.angle, scale: 1 }}
                transition={{
                  delay: photo.delay,
                  type: "spring",
                  damping: 11,
                  stiffness: 75,
                }}
                className="flex-shrink-0"
              >
                {/* Polaroid frame */}
                <div
                  className="bg-white shadow-2xl"
                  style={{ padding: "6px", paddingBottom: "32px", width: "105px" }}
                >
                  {/* Photo area */}
                  <div className="relative w-full overflow-hidden" style={{ height: "92px" }}>
                    {/* Gradient fallback (always visible behind) */}
                    <div className="absolute inset-0" style={{ background: photo.bg }} />
                    {/* Emoji centered */}
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      {photo.emoji}
                    </div>
                    {/* Real photo on top if it loads */}
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  {/* Handwritten caption */}
                  <p
                    className="text-center text-gray-500 italic mt-2 px-1 leading-tight"
                    style={{
                      fontSize: "8px",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Final message */}
        {stage >= 7 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 font-serif text-center text-foreground/90 px-6"
            style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.4rem)", maxWidth: "480px" }}
          >
            {typedMessage}
            <span className="animate-pulse">|</span>
          </motion.p>
        )}
      </motion.div>

      {/* Cadela with beach hat — slides in from right at stage 6 */}
      <AnimatePresence>
        {stage >= 6 && (
          <motion.div
            key="cadela"
            initial={{ opacity: 0, x: 160 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 14, stiffness: 90 }}
            className="absolute bottom-4 right-4 md:right-8 z-20"
          >
            <div className="relative">
              {/* Beach hat */}
              <svg
                className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 w-20 md:w-24 h-auto"
                viewBox="0 0 100 50"
              >
                <ellipse cx="50" cy="42" rx="46" ry="8" fill="#f4d03f" stroke="#c9a227" strokeWidth="1.5" />
                <ellipse cx="50" cy="29" rx="28" ry="18" fill="#f4d03f" stroke="#c9a227" strokeWidth="1.5" />
                <rect x="22" y="35" width="56" height="7" rx="1" fill="#e74c3c" />
                {/* Flower */}
                <circle cx="68" cy="30" r="3" fill="white" opacity="0.7" />
                <circle cx="68" cy="30" r="1.5" fill="#f4d03f" />
              </svg>

              <img
                src="/cadela.jpeg"
                alt="Potato the dog"
                className="w-28 md:w-40 h-auto"
              />

              {/* Speech bubble */}
              <div
                className="absolute -left-28 md:-left-36 top-4 bg-white rounded-lg px-2 py-2 shadow-md"
                style={{ minWidth: "100px" }}
              >
                <p className="text-[9px] md:text-[10px] text-gray-700 italic font-serif leading-snug">
                  ela ficou em casa.<br />com inveja.
                </p>
                <div
                  className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-0 h-0"
                  style={{
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: "7px solid white",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
