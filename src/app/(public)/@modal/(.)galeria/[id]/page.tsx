"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { galleryItems } from "@/lib/data/mockData";
import Image from "next/image";

export default function GaleriaModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const item = galleryItems.find(i => i.id === params.id);

  if (!item) {
    router.push("/galeria");
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
          <div className="relative h-96 overflow-hidden rounded-t-2xl">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
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
                {item.category}
              </span>
              <h2 className="text-white text-3xl font-bold">{item.title}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              <span>{item.date}</span>
              {item.author && (
                <>
                  <span>•</span>
                  <span>{item.author}</span>
                </>
              )}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {item.description}
            </p>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

