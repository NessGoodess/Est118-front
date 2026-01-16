"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { galleryItems } from "@/lib/data/mockData";
import Link from "next/link";
import Image from "next/image";

export default function GaleriaItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = galleryItems.find(i => i.id === id);

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
            <Link href="/galeria" className="text-white/80 hover:text-white mb-4 inline-block">
              ← Volver a Galería
            </Link>
            <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {item.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merriweather">
              {item.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span>{item.date}</span>
              {item.author && (
                <>
                  <span>•</span>
                  <span>{item.author}</span>
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
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8 md:p-12">
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {item.description}
            </p>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-8 border-t border-gray-200">
              <Link
                href="/galeria"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Ver más en la galería
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

