import { z } from "zod"
import { GALLERY_CATEGORIES } from "@/features/gallery/types/gallery"

export const GALLERY_RATIOS = ["4/3", "3/4", "1/1", "16/9"] as const

const galleryPhotoSchema = z.object({
  src: z.string().min(1, "Falta la imagen"),
  alt: z.string().min(2, "El texto alternativo es requerido").max(120),
  caption: z.string().max(160).optional().or(z.literal("")),
  ratio: z.enum(GALLERY_RATIOS),
})

export const gallerySchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(120, "El título no puede superar 120 caracteres"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Solo letras minúsculas, números y guiones")
    .max(80, "Máximo 80 caracteres")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(600, "La descripción no puede superar 600 caracteres")
    .optional()
    .or(z.literal("")),
  category: z.enum(GALLERY_CATEGORIES),
  coverSrc: z.string().optional().or(z.literal("")),
  featured: z.boolean(),
  publishedAt: z.string().optional().or(z.literal("")),
  photos: z
    .array(galleryPhotoSchema)
    .min(1, "Agrega al menos una foto al álbum")
    .max(120, "El álbum admite hasta 120 fotos"),
})

export type GalleryFormValues = z.infer<typeof gallerySchema>
export type GalleryPhotoFormValue = z.infer<typeof galleryPhotoSchema>

export const GALLERY_FORM_DEFAULTS: GalleryFormValues = {
  title: "",
  slug: "",
  description: "",
  category: "Talleres",
  coverSrc: "",
  featured: false,
  publishedAt: "",
  photos: [],
}
