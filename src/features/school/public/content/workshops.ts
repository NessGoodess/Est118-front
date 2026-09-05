import type { AppIconName } from "@/components/ui/icons"
import { AdmissionWorkshop } from "@/features/admissions/types/workshops"

export type PublicWorkshop = {
  id: string
  name: string
  shortName: string
  description: string
  icon: AppIconName
}

/** Official workshops shown on the public site. Values match admission choices. */
export const PUBLIC_WORKSHOPS: PublicWorkshop[] = [
  {
    id: AdmissionWorkshop.Informatics,
    name: AdmissionWorkshop.Informatics,
    shortName: "Informática",
    description: "Programación, sistemas y tecnología de la información.",
    icon: "cpu",
  },
  {
    id: AdmissionWorkshop.IndustrialDesign,
    name: AdmissionWorkshop.IndustrialDesign,
    shortName: "Diseño industrial",
    description: "Creatividad y diseño de productos con enfoque funcional.",
    icon: "factory",
  },
  {
    id: AdmissionWorkshop.ApparelAndTextile,
    name: AdmissionWorkshop.ApparelAndTextile,
    shortName: "Confección del vestido",
    description: "Costura, diseño y confección de prendas de vestir.",
    icon: "palette",
  },
  {
    id: AdmissionWorkshop.MachinesAndControl,
    name: AdmissionWorkshop.MachinesAndControl,
    shortName: "Máquinas y control",
    description: "Maquinaria, herramientas y sistemas automatizados.",
    icon: "cog",
  },
]
