"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";
import { Confetti } from "@/components/confetti";

// Simple hand-drawn style Europe map paths
const europePaths = {
  // Portugal - highlighted
  portugal: "M 95 145 L 90 150 L 88 165 L 92 180 L 98 185 L 102 175 L 100 160 L 95 145",
  // Spain
  spain: "M 98 185 L 102 175 L 100 160 L 95 145 L 115 140 L 145 145 L 165 155 L 175 170 L 165 185 L 140 195 L 110 195 L 98 185",
  // France  
  france: "M 165 155 L 175 130 L 200 115 L 230 120 L 240 145 L 235 165 L 210 175 L 175 170 L 165 155",
  // Italy
  italy: "M 240 145 L 260 155 L 275 185 L 265 210 L 250 220 L 260 195 L 255 175 L 245 160 L 240 145",
  // UK
  uk: "M 155 95 L 165 85 L 175 90 L 180 105 L 170 120 L 160 115 L 155 100 L 155 95",
  // Germany area
  germany: "M 230 120 L 250 110 L 270 115 L 275 135 L 260 150 L 240 145 L 230 120",
  // Mediterranean coastline hint
  coast: "M 165 185 L 190 190 L 220 195 L 245 200 L 260 195",
};

// Málaga position on the map (southern Spain coast)
const malagaPosition = { x: 135, y: 188 };
// Portugal start position
const portugalPosition = { x: 92, y: 165 };

interface MapRevealProps {
  onComplete?: () => void;
}

export function MapReveal({ onComplete }: MapRevealProps) {
  const [stage, setStage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [planeProgress, setPlaneProgress] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [typedDates, setTypedDates] = useState("");
  const [typedMessage, setTypedMessage] = useState("");

  // Progress motion value for the plane
  const progress = useMotionValue(0);
  
  // Interpolate plane position along path
  const planeX = useTransform(progress, [0, 1], [portugalPosition.x, malagaPosition.x]);
  const planeY = useTransform(progress, [0, 1], [portugalPosition.y - 20, malagaPosition.y - 15]);

  // Stage progression
  useEffect(() => {
    // Stage 0: Initial, Stage 1: Map visible
    const timer1 = setTimeout(() => setStage(1), 500);
    
    // Stage 2: Plane starts
    const timer2 = setTimeout(() => setStage(2), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Plane animation
  useEffect(() => {
    if (stage === 2) {
      animate(progress, 1, {
        duration: 2.5,
        ease: "easeInOut",
        onUpdate: (v) => setPlaneProgress(v),
        onComplete: () => {
          setShowStars(true);
          setTimeout(() => setStage(3), 800);
        },
      });
    }
  }, [stage, progress]);

  // Type dates
  useEffect(() => {
    if (stage >= 3) {
      const dates = "19 a 22 de Setembro";
      let i = 0;
      const dateTimer = setInterval(() => {
        if (i <= dates.length) {
          setTypedDates(dates.slice(0, i));
          i++;
        } else {
          clearInterval(dateTimer);
          setTimeout(() => setStage(4), 500);
        }
      }, 80);
      return () => clearInterval(dateTimer);
    }
  }, [stage]);

  // Type final message
  useEffect(() => {
    if (stage >= 5) {
      const message = "Feliz aniversário, Mariana. Agora vai fazer a mala.";
      let i = 0;
      const msgTimer = setInterval(() => {
        if (i <= message.length) {
          setTypedMessage(message.slice(0, i));
          i++;
        } else {
          clearInterval(msgTimer);
          setTimeout(() => onComplete?.(), 1500);
        }
      }, 50);
      return () => clearInterval(msgTimer);
    }
  }, [stage, onComplete]);

  // Show photos, then dog, then message
  useEffect(() => {
    if (stage === 4) {
      setTimeout(() => setStage(4.5), 1500); // Dog slides in
      setTimeout(() => {
        setShowConfetti(true);
        setStage(5); // Message types
      }, 3000);
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {showConfetti && <Confetti />}
      
      {/* Map container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {stage < 3 && (
          <svg
            viewBox="0 0 350 280"
            className="w-full max-w-2xl h-auto px-8"
            style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
          >
            {/* Background water hint */}
            <rect x="0" y="0" width="350" height="280" fill="oklch(0.15 0.02 250)" rx="8" />
            
            {/* Country outlines - hand drawn style */}
            <motion.path
              d={europePaths.uk}
              fill="none"
              stroke="oklch(0.4 0.02 250)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.path
              d={europePaths.france}
              fill="none"
              stroke="oklch(0.4 0.02 250)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.path
              d={europePaths.germany}
              fill="none"
              stroke="oklch(0.4 0.02 250)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.path
              d={europePaths.italy}
              fill="none"
              stroke="oklch(0.4 0.02 250)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.path
              d={europePaths.spain}
              fill="none"
              stroke="oklch(0.4 0.02 250)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
            />
            {/* Portugal - highlighted in amber */}
            <motion.path
              d={europePaths.portugal}
              fill="oklch(0.65 0.15 65 / 0.4)"
              stroke="oklch(0.75 0.12 65)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 0.4 }}
              transition={{ duration: 1.2 }}
            />
            <motion.path
              d={europePaths.coast}
              fill="none"
              stroke="oklch(0.35 0.02 250)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            />

            {/* Málaga pin */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", damping: 10 }}
            >
              {/* Pin shadow */}
              <ellipse cx={malagaPosition.x} cy={malagaPosition.y + 3} rx="4" ry="2" fill="rgba(0,0,0,0.3)" />
              {/* Pin */}
              <path
                d={`M ${malagaPosition.x} ${malagaPosition.y - 15} 
                   c -8 0 -12 6 -12 12 
                   c 0 8 12 18 12 18 
                   c 0 0 12 -10 12 -18 
                   c 0 -6 -4 -12 -12 -12 z`}
                fill="#c41e3a"
                stroke="#8b1425"
                strokeWidth="1"
              />
              <circle cx={malagaPosition.x} cy={malagaPosition.y - 10} r="4" fill="white" opacity="0.8" />
            </motion.g>

            {/* Flight path - dotted trail */}
            {stage >= 2 && (
              <motion.path
                d={`M ${portugalPosition.x} ${portugalPosition.y - 20} Q ${(portugalPosition.x + malagaPosition.x) / 2} ${portugalPosition.y - 60} ${malagaPosition.x} ${malagaPosition.y - 15}`}
                fill="none"
                stroke="oklch(0.75 0.12 65)"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: planeProgress }}
              />
            )}

            {/* Paper plane */}
            {stage >= 2 && (
              <motion.g style={{ x: planeX, y: planeY }}>
                <motion.g
                  animate={{ rotate: stage >= 2 ? [0, -5, 5, 0] : 0 }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {/* Simple paper plane */}
                  <path
                    d="M -8 0 L 8 0 L 0 -12 Z"
                    fill="white"
                    stroke="oklch(0.5 0.02 250)"
                    strokeWidth="0.5"
                    transform="rotate(45)"
                  />
                  <path
                    d="M 0 -2 L 0 6"
                    stroke="oklch(0.5 0.02 250)"
                    strokeWidth="0.5"
                    transform="rotate(45)"
                  />
                </motion.g>
              </motion.g>
            )}

            {/* Star explosion at Málaga */}
            {showStars && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.text
                    key={i}
                    x={malagaPosition.x}
                    y={malagaPosition.y - 10}
                    fontSize="12"
                    fill="oklch(0.75 0.12 65)"
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0.5],
                      x: Math.cos((i * Math.PI * 2) / 8) * 25,
                      y: Math.sin((i * Math.PI * 2) / 8) * 25,
                      opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    ✦
                  </motion.text>
                ))}
              </>
            )}
          </svg>
        )}
      </motion.div>

      {/* MÁLAGA reveal - Stage 3+ */}
      {stage >= 3 && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="font-serif text-7xl md:text-9xl lg:text-[12rem] font-bold text-primary tracking-tight"
          >
            MÁLAGA
          </motion.h1>

          {/* Dates */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-2xl md:text-3xl text-foreground/80 font-serif"
          >
            {typedDates}
            <span className="animate-pulse">|</span>
          </motion.p>

          {/* Photo placeholders */}
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 mt-10"
            >
              {[
                { color: "oklch(0.75 0.12 65)", label: "praia" },
                { color: "oklch(0.65 0.18 30)", label: "tapas" },
                { color: "oklch(0.6 0.12 200)", label: "sol" },
              ].map((photo, i) => (
                <motion.div
                  key={photo.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-20 h-20 md:w-28 md:h-28 rounded-lg shadow-lg"
                    style={{ backgroundColor: photo.color }}
                  />
                  <span className="mt-2 text-xs text-muted-foreground italic">{photo.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Dog (Potato) with beach hat */}
          {stage >= 4.5 && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="absolute bottom-8 right-4 md:right-12 z-20"
            >
              <div className="relative">
                {/* Dog image */}
                <img
                  src="/cadela.jpeg"
                  alt="Potato the dog"
                  className="w-36 md:w-44 h-auto rounded-lg shadow-xl object-cover"
                  style={{ aspectRatio: "1/1", objectFit: "cover" }}
                />
                
                {/* Beach hat SVG overlay */}
                <svg
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 md:w-24 h-auto"
                  viewBox="0 0 100 50"
                >
                  {/* Hat brim */}
                  <ellipse cx="50" cy="42" rx="45" ry="8" fill="#f4d03f" stroke="#d4a017" strokeWidth="1" />
                  {/* Hat dome */}
                  <ellipse cx="50" cy="30" rx="28" ry="18" fill="#f4d03f" stroke="#d4a017" strokeWidth="1" />
                  {/* Hat band */}
                  <rect x="22" y="36" width="56" height="6" fill="#e74c3c" />
                </svg>
                
                {/* Speech bubble */}
                <div
                  className="absolute -left-32 md:-left-40 top-4 bg-white rounded-lg px-3 py-2 shadow-md"
                  style={{ minWidth: "120px" }}
                >
                  <p className="text-[11px] md:text-xs text-gray-700 italic font-serif leading-tight">
                    ela ficou em casa.
                    <br />
                    com inveja.
                  </p>
                  {/* Speech bubble tail */}
                  <div
                    className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-0 h-0"
                    style={{
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      borderLeft: "8px solid white",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Final message */}
          {stage >= 5 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-xl md:text-2xl text-foreground font-serif text-center max-w-md"
            >
              {typedMessage}
              <span className="animate-pulse">|</span>
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
}
