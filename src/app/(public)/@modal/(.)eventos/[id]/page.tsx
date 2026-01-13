"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { eventItems } from "@/lib/data/mockData";

export default function EventoModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const item = eventItems.find(i => i.id === params.id);

  if (!item) {
    router.push("/eventos");
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => router.back()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="relative h-64 overflow-hidden rounded-t-2xl">
            {item.imagen ? (
              <img
                src={item.imagen}
                alt={item.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800" />
            )}
            <button
              onClick={() => router.back()}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-gray-800 shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                {item.tipo}
              </span>
              <h2 className="text-white text-3xl font-bold">{item.titulo}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Fecha</p>
                <p className="font-semibold text-gray-900">{item.fecha}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Hora</p>
                <p className="font-semibold text-gray-900">{item.hora}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 col-span-2">
                <p className="text-xs text-gray-600 mb-1">Lugar</p>
                <p className="font-semibold text-gray-900">{item.lugar}</p>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {item.descripcion}
            </p>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {item.contenido}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

