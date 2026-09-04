"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { eventItems } from "@/lib/data/mockData";
import Link from "next/link";
import Image from "next/image";

export default function EventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = eventItems.find(i => i.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface-app">
      {/* Header */}
      <section className="public-hero-offset relative bg-linear-to-r from-brand-900 via-brand-700 to-brand-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-linear-to-t from-brand-900/90 to-brand-700/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-56 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-public-on-media"
          >
            <Link href="/eventos" className="text-public-on-media/80 hover:text-public-on-media mb-4 inline-block">
              ← Volver a Eventos
            </Link>
            <span className="inline-block bg-public-cta text-public-cta-fg px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {item.tipo}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merriweather">
              {item.titulo}
            </h1>
            <div className="flex items-center gap-4 text-public-on-media/90">
              <span>{item.fecha}</span>
              <span>•</span>
              <span>{item.hora}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-surface-elevated rounded-2xl shadow-xl overflow-hidden"
        >
          {item.imagen && (
            <div className="relative h-96 md:h-[500px]">
              <Image
                src={item.imagen}
                alt={item.titulo}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-primary-soft rounded-lg p-4">
                <p className="text-xs text-fg-muted mb-1">Fecha</p>
                <p className="font-semibold text-foreground">{item.fecha}</p>
              </div>
              <div className="bg-primary-soft rounded-lg p-4">
                <p className="text-xs text-fg-muted mb-1">Hora</p>
                <p className="font-semibold text-foreground">{item.hora}</p>
              </div>
              <div className="bg-primary-soft rounded-lg p-4">
                <p className="text-xs text-fg-muted mb-1">Lugar</p>
                <p className="font-semibold text-foreground">{item.lugar}</p>
              </div>
            </div>

            <p className="text-foreground text-lg leading-relaxed mb-6 font-semibold">
              {item.descripcion}
            </p>

            <div className="prose max-w-none">
              <p className="text-foreground leading-relaxed text-base">
                {item.contenido}
              </p>
            </div>

            <div className="pt-8 border-t border-border mt-8">
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold"
              >
                ← Ver más eventos
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

