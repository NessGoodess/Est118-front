"use client";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { newsItems } from "@/lib/data/mockData";
import Link from "next/link";

export default function NoticiaPage({ params }: { params: { id: string } }) {
  const item = newsItems.find(i => i.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
            <Link href="/noticias" className="text-white/80 hover:text-white mb-4 inline-block">
              ← Volver a Noticias
            </Link>
            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {item.categoria}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merriweather">
              {item.titulo}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span>{item.fecha}</span>
              {item.autor && (
                <>
                  <span>•</span>
                  <span>{item.autor}</span>
                </>
              )}
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
          <div className="relative h-96 md:h-[500px]">
            <img
              src={item.imagen}
              alt={item.titulo}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-12">
            <p className="text-gray-700 text-lg leading-relaxed mb-6 font-semibold">
              {item.resumen}
            </p>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-base">
                {item.contenido}
              </p>
            </div>

            <div className="pt-8 border-t border-gray-200 mt-8">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Ver más noticias
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

