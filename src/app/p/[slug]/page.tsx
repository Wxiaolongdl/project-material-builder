import { notFound } from "next/navigation";
import { PublicProjectPage } from "@/components/public-project-page";
import { ErrorBoundary } from "@/components/error-boundary";
import { loadProjectBySlug } from "@/lib/project-repository";

export default async function ProjectPublicRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadProjectBySlug(slug);
  if (!loaded) {
    notFound();
  }

  return (
    <ErrorBoundary projectId={loaded.project.id} route={`/p/${slug}`} featureKey="public_project_page">
      <PublicProjectPage material={loaded.material} project={loaded.project} sections={loaded.bundle.sections} slug={slug} />
    </ErrorBoundary>
  );
}
