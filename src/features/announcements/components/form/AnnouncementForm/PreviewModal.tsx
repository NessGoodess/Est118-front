"use client"

import Modal from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import LivePreview from "./LivePreview"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"

interface AnnouncementPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  values: AnnouncementFormValues
  imagePreview: string | null
  videoPreview: string | null
}

/**
 * Live public-card preview inside the shared app Modal
 * (same pattern as StudentPhotoModal / admissions convert modals).
 */
export default function AnnouncementPreviewModal({
  isOpen,
  onClose,
  values,
  imagePreview,
  videoPreview,
}: AnnouncementPreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vista previa del aviso"
      maxWidth="6xl"
      footerActions
      footerActionsContent={
        <Button type="button" variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <LivePreview
        values={values}
        imagePreview={imagePreview}
        videoPreview={videoPreview}
      />
    </Modal>
  )
}
