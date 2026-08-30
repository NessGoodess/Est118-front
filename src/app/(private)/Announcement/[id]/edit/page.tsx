import { AnnouncementForm } from "@/features/announcements"

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AnnouncementForm editId={id} />
}
