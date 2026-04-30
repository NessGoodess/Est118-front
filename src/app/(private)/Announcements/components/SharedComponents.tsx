import React, { useRef, useState } from "react"
import Image from "next/image"

export function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-950/8 text-blue-950">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  )
}

export function Divider() {
  return <div className="my-7 h-px w-full bg-gray-100" />
}

export function ToggleChip({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
        checked
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full border-2 transition-colors ${
          checked ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
        }`}
      />
      {label}
    </button>
  )
}

// File drop zone
export function FileDropZone({
  accept,
  label,
  preview,
  error,
  onChange,
  onClear,
}: {
  accept: string
  label: string
  preview?: string | null
  error?: string
  onChange: (file: File) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onChange(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-150 ${
          error
            ? "border-red-300 bg-red-50"
            : dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
        }`}
      >
        {preview ? (
          <>
            {accept.startsWith("image") ? (
              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                <Image src={preview} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <video src={preview} className="h-32 w-full rounded-lg object-contain" muted />
            )}
            <button
              type="button"
              aria-label="Quitar archivo"
              onClick={(e) => { e.stopPropagation(); onClear() }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow hover:bg-red-50 hover:text-red-600"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <svg className={`h-8 w-8 transition-colors ${dragging ? "text-blue-500" : "text-gray-400 group-hover:text-blue-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-center text-xs text-gray-500">
              <span className="font-semibold text-blue-600">Haz clic</span> o arrastra el archivo aquí
            </p>
            <p className="text-[11px] text-gray-400">{label}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onChange(file)
          }}
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5zm.75 5.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
