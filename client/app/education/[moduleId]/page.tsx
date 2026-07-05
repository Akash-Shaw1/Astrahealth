import { notFound } from "next/navigation"
import ModuleDetailPage from "@/components/module-detail-page"
import educationData from "@/data/education-modules.json"

interface ModulePageProps {
  params: Promise<{
    moduleId: string
  }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params
  const module = educationData.modules.find((m) => m.id === moduleId)

  if (!module) {
    notFound()
  }

  return <ModuleDetailPage module={module} />
}

export async function generateStaticParams() {
  return educationData.modules.map((module) => ({
    moduleId: module.id,
  }))
}
