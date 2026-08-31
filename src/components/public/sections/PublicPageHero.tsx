"use client";

import { motion } from "framer-motion";

interface PublicPageHeroProps {
  title: string;
  description: string;
}

export default function PublicPageHero({ title, description }: PublicPageHeroProps) {
  return (
    <section className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900">
      <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-linear-to-t from-brand-900/90 to-brand-700/70" />
      <div className="relative z-10 mx-auto flex min-h-48 max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-56 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 className="mb-4 font-merriweather text-4xl font-bold md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-xl text-white/90 md:text-2xl">{description}</p>
        </motion.div>
      </div>
    </section>
  );
}
