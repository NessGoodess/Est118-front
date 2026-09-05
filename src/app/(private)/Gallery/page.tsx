"use client"

import { useEffect, useState } from "react"
import {
  AdminGalleriesList,
  AdminGalleriesListSkeleton,
  getGalleries,
  type GalleryRawItem,
} from "@/features/gallery"

export default function GalleriesListPage() {
  const [data, setData] = useState<GalleryRawItem[] | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await getGalleries()
        if (!cancelled) setData(result)
      } catch {
        if (!cancelled) setData([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!data) {
    return <AdminGalleriesListSkeleton />
  }

  return <AdminGalleriesList data={data} />
}
