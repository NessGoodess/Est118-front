import type { ReactNode } from "react"
import { IconByName } from "@/components/ui/icons"

/** Icons consumed by DataTable action buttons. */
export const tableIcons: Record<string, ReactNode> = {
  edit: <IconByName name="edit" className="w-4 h-4" />,
  trash: <IconByName name="trash" className="w-4 h-4" />,
  eye: <IconByName name="eye" className="w-4 h-4" />,
  duplicate: <IconByName name="fileText" className="w-4 h-4" />,
  share: <IconByName name="share" className="w-4 h-4" />,
}
