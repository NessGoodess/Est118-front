import { EventForm } from "@/features/events"

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EventForm editId={id} />
}
