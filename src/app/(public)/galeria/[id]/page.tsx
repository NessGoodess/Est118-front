"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { galleryItems } from "@/lib/data/mockData";
import Link from "next/link";
import Image from "next/image";

const RATIO_CLASS: Record<string, string> = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
};

export default function GaleriaItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = galleryItems.find(i => i.id === id);

  if (!item) {
    notFound();
  }

  const ratioClass = RATIO_CLASS[item.ratio ?? "4/3"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-muted to-surface-elevated">
      {/* Slim top header */}
      <section className="public-hero-offset relative bg-linear-to-r from-brand-900 via-brand-700 to-brand-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-linear-to-t from-brand-900/90 to-brand-700/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-32 md:min-h-40 flex items-end pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-public-on-media"
          >
            <Link href="/galeria" className="text-public-on-media-muted hover:text-public-on-media text-sm mb-2 inline-flex items-center gap-1">
              ← Back to Gallery
            </Link>
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-block bg-accent-gold text-foreground px-3 py-1 rounded-full text-xs font-bold">
                {item.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold font-merriweather line-clamp-2">
                {item.title}
              </h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2-col content: image LEFT, description RIGHT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10"
        >
          {/* LEFT — main image, adopts its natural ratio */}
          <div className={`w-full md:w-[55%] md:shrink-0 overflow-hidden rounded-2xl shadow-xl relative ${ratioClass}`}>
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
          </div>

          {/* RIGHT — description panel */}
          <div className="flex flex-1 flex-col gap-5">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
              <span>{item.date}</span>
              {item.author && (
                <>
                  <span aria-hidden>·</span>
                  <span>{item.author}</span>
                </>
              )}
            </div>

            {/* Decorative rule */}
            <div className="h-[3px] w-10 rounded-full bg-accent-gold" />

            {/* Description */}
            <p className="text-base leading-relaxed text-foreground">
              {item.description}
            </p>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-soft border border-border px-3 py-1 text-xs font-medium text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Back link */}
            <div className="mt-auto pt-6 border-t border-border">
              <Link
                href="/galeria"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                ← View more in gallery
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
