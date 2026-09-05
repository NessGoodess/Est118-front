/** Shape shared by announcement gallery blocks and gallery albums. */
export interface PhotoItem {
  src: string
  alt: string
  caption?: string
}

export type PhotoLayout = "carousel" | "grid"
