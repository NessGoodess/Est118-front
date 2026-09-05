import { GalleryForm } from "@/features/gallery"

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <GalleryForm editId={id} />
}
