import { AdminProjectEditor } from "@/components/admin-project-editor";

export default async function AdminProjectRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProjectEditor projectId={id} />;
}
