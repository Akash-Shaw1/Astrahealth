import { notFound } from "next/navigation"
import ModuleDetailPage from "@/components/module-detail-page"
import educationData from "@/data/education-modules.json"

interface ModulePageProps {
  params: {
    moduleId: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  const module = educationData.modules.find((m) => m.id === params.moduleId)

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
