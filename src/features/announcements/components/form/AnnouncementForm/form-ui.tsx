"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { IconByName } from "@/components/ui/icons"

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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-brand-strong">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-fg-muted">{description}</p>}
      </div>
    </div>
  )
}

export function Divider() {
  return <div className="my-7 h-px w-full bg-surface-muted" />
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
          ? "border-border bg-primary-soft text-primary"
          : "border-border bg-surface-elevated text-fg-muted hover:border-border"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full border-2 transition-colors ${
          checked ? "border-primary bg-primary" : "border-border bg-surface-elevated"
        }`}
      />
      {label}
    </button>
  )
}

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
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-150 ${
          error
            ? "border-danger/40 bg-danger/10"
            : dragging
              ? "border-primary bg-primary-soft"
              : "border-border bg-surface-muted hover:border-primary/40 hover:bg-primary-soft/40"
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
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface-elevated/80 text-fg-muted shadow hover:bg-danger/10 hover:text-danger"
            >
              <IconByName name="x" className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <IconByName
              name="upload"
              className={`h-8 w-8 transition-colors ${dragging ? "text-primary" : "text-fg-muted group-hover:text-primary"}`}
            />
            <p className="text-center text-xs text-fg-muted">
              <span className="font-semibold text-primary">Haz clic</span> o arrastra el archivo aquí
            </p>
            <p className="text-[11px] text-fg-muted">{label}</p>
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
        <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
          <IconByName name="alert" className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
