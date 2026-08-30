import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function NoticiaModalRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/Announcements/${id}`);
}
