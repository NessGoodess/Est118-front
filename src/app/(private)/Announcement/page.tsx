"use client"

import { useEffect, useState } from "react"
import {
  AdminAnnouncementsList,
  getAnnouncements,
  type AnnouncementRawItem,
} from "@/features/announcements"
import AdminAnnouncementsListSkeleton from "@/features/announcements/components/skeletons/AdminAnnouncementsListSkeleton"

export default function AnnouncementsListPage() {
  const [data, setData] = useState<AnnouncementRawItem[] | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await getAnnouncements()
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
    return <AdminAnnouncementsListSkeleton />
  }

  return <AdminAnnouncementsList data={data} />
}
