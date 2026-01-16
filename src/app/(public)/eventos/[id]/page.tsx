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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-700/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <Link href="/eventos" className="text-white/80 hover:text-white mb-4 inline-block">
              ← Volver a Eventos
            </Link>
            <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {item.tipo}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merriweather">
              {item.titulo}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
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
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
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
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Fecha</p>
                <p className="font-semibold text-gray-900">{item.fecha}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Hora</p>
                <p className="font-semibold text-gray-900">{item.hora}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Lugar</p>
                <p className="font-semibold text-gray-900">{item.lugar}</p>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6 font-semibold">
              {item.descripcion}
            </p>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-base">
                {item.contenido}
              </p>
            </div>

            <div className="pt-8 border-t border-gray-200 mt-8">
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
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

