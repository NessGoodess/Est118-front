"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import styles from "./section1.module.css";

export default function Hero() {
  const blurRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (!blurRef.current) return;

    const rect = blurRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    blurRef.current.style.setProperty("--x", `${x}px`);
    blurRef.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <div className="relative min-h-screen bg-[url('/background5.png')] bg-cover bg-center">

      {/* Capa blur interactiva */}
      <motion.div
        ref={blurRef}
        onMouseMove={handleMouseMove}
        className={`absolute inset-0 bg-surface-elevated/25 backdrop-blur-2xl ${styles.spotlight}`}
      />

      {/* Contenido */}
      <div className="relative z-10 p-20 text-white">
        <h1 className="text-4xl font-bold">
          Escuela Secundaria Técnica 118
        </h1>
        <p className="mt-4 text-lg text-white/90">
          Educación técnica para el futuro
        </p>
      </div>

    </div>
  );
}
