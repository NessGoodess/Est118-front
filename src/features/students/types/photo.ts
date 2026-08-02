import { Student } from "@/features/students/types/students";

/** Mínimo para abrir el modal desde lista o expediente. */
export type PhotoModalStudentRef = Pick<Student, "id"> & { name: string };

export type FacingMode = "user" | "environment";

export type PhotoLoadState = "loading" | "loaded" | "empty" | "error";

export interface StudentPhotoStatus {
  actionLabel: string;
  hasPhoto: boolean;
  currentPhotoUrl: string | null;
}

export interface StudentPhotoModalProps {
  student: PhotoModalStudentRef | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}
