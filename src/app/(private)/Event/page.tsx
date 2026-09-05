"use client"

import { useEffect, useState } from "react"
import {
  AdminEventsList,
  AdminEventsListSkeleton,
  getEvents,
  type EventRawItem,
} from "@/features/events"

export default function EventsListPage() {
  const [data, setData] = useState<EventRawItem[] | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await getEvents()
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
    return <AdminEventsListSkeleton />
  }

  return <AdminEventsList data={data} />
}
