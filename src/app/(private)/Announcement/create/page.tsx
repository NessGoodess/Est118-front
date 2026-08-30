import { AnnouncementForm } from "@/features/announcements"

type Props = {
  searchParams: Promise<{ from?: string }>
}

export default async function CreateAnnouncementPage({ searchParams }: Props) {
  const { from } = await searchParams
  return <AnnouncementForm duplicateFromId={from} />
}
