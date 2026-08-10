"use client";

import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

export default function ReaderConfigSkeleton() {
  return (
    <div
      className="animate-pulse space-y-4"
      aria-busy="true"
      aria-label="Cargando configuración de lectores"
    >
      <div className="rounded-xl border border-border bg-surface-elevated p-4 shadow-sm">
        <div className="flex justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBone className="h-6 w-56" />
            <SkeletonBone className="h-4 w-72 max-w-full" />
          </div>
          <SkeletonBone className="h-8 w-24 shrink-0" />
        </div>
        <div className="mt-4 flex gap-2">
          <SkeletonBone className="h-6 w-28 rounded-full" />
          <SkeletonBone className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
        <SkeletonBone className="h-10 w-full rounded-none" />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBone
            key={i}
            className="h-16 w-full rounded-none border-t border-border"
          />
        ))}
      </div>
    </div>
  );
}
