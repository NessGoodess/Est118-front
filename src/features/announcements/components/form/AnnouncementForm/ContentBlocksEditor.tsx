"use client";

import type { AnnouncementContentBlock } from "@/features/announcements/types/announcement";
import type { MediaCollection } from "@/features/media";
import GalleryBlockEditor from "./GalleryBlockEditor";
import GalleryRefBlockEditor from "./GalleryRefBlockEditor";

type Props = {
  value: AnnouncementContentBlock[];
  onChange: (blocks: AnnouncementContentBlock[]) => void;
  /** Storage folder for photos uploaded in gallery blocks. */
  mediaCollection?: MediaCollection;
};

const emptyParagraph = (): AnnouncementContentBlock => ({
  type: "paragraph",
  text: "",
});

const emptyList = (): AnnouncementContentBlock => ({
  type: "list",
  items: [""],
});

const emptyYoutube = (): AnnouncementContentBlock => ({
  type: "youtube",
  youtubeId: "",
  caption: "",
});

const emptyImage = (): AnnouncementContentBlock => ({
  type: "image",
  src: "",
  alt: "",
  caption: "",
});

const emptyGallery = (): AnnouncementContentBlock => ({
  type: "gallery",
  images: [],
  layout: "carousel",
  title: "",
  caption: "",
});

const emptyGalleryRef = (): AnnouncementContentBlock => ({
  type: "gallery_ref",
  galleryId: 0,
  layout: "carousel",
  title: "",
});

export default function ContentBlocksEditor({
  value,
  onChange,
  mediaCollection = "announcements",
}: Props) {
  const blocks = value ?? [];

  const updateAt = (index: number, next: AnnouncementContentBlock) => {
    const copy = [...blocks];
    copy[index] = next;
    onChange(copy);
  };

  const removeAt = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([...blocks, emptyParagraph()])}
          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary-soft"
        >
          + Párrafo
        </button>
        <button
          type="button"
          onClick={() => onChange([...blocks, emptyList()])}
          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary-soft"
        >
          + Lista
        </button>
        <button
          type="button"
          onClick={() => onChange([...blocks, emptyImage()])}
          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary-soft"
        >
          + Imagen (URL)
        </button>
        <button
          type="button"
          onClick={() => onChange([...blocks, emptyGallery()])}
          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary-soft"
        >
          + Galería de fotos
        </button>
        <button
          type="button"
          onClick={() => onChange([...blocks, emptyGalleryRef()])}
          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary-soft"
        >
          + Vincular álbum
        </button>
        <button
          type="button"
          onClick={() => onChange([...blocks, emptyYoutube()])}
          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary-soft"
        >
          + YouTube
        </button>
      </div>

      {blocks.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-6 text-center text-xs text-fg-muted">
          Sin bloques extendidos. Agrega párrafos, listas o media para la vista
          de detalle (sin HTML).
        </p>
      )}

      {blocks.map((block, index) => (
        <div
          key={`${block.type}-${index}`}
          className="rounded-xl border border-border bg-surface-muted/40 p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-fg-muted">
              {block.type === "paragraph" && "Párrafo"}
              {block.type === "list" && "Lista"}
              {block.type === "image" && "Imagen"}
              {block.type === "youtube" && "YouTube"}
              {block.type === "video" && "Video"}
              {block.type === "gallery" &&
                `Galería · ${block.images?.length ?? 0} ${
                  (block.images?.length ?? 0) === 1 ? "foto" : "fotos"
                }`}
              {block.type === "gallery_ref" && "Álbum vinculado"}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Subir bloque"
                onClick={() => move(index, -1)}
                className="rounded-md px-2 py-1 text-xs text-fg-muted hover:bg-surface-elevated"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Bajar bloque"
                onClick={() => move(index, 1)}
                className="rounded-md px-2 py-1 text-xs text-fg-muted hover:bg-surface-elevated"
              >
                ↓
              </button>
              <button
                type="button"
                aria-label="Eliminar bloque"
                onClick={() => removeAt(index)}
                className="rounded-md px-2 py-1 text-xs text-danger hover:bg-danger/10"
              >
                Eliminar
              </button>
            </div>
          </div>

          {block.type === "paragraph" && (
            <textarea
              value={block.text}
              onChange={(e) =>
                updateAt(index, { type: "paragraph", text: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground"
              placeholder="Escribe el párrafo…"
            />
          )}

          {block.type === "list" && (
            <textarea
              value={block.items.join("\n")}
              onChange={(e) =>
                updateAt(index, {
                  type: "list",
                  items: e.target.value.split("\n"),
                })
              }
              rows={4}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground"
              placeholder={"Un ítem por línea"}
            />
          )}

          {block.type === "image" && (
            <div className="space-y-2">
              <input
                value={block.src}
                onChange={(e) =>
                  updateAt(index, { ...block, src: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                placeholder="URL de la imagen"
              />
              <input
                value={block.alt}
                onChange={(e) =>
                  updateAt(index, { ...block, alt: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                placeholder="Texto alternativo"
              />
              <input
                value={block.caption ?? ""}
                onChange={(e) =>
                  updateAt(index, { ...block, caption: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                placeholder="Pie de foto (opcional)"
              />
            </div>
          )}

          {block.type === "youtube" && (
            <div className="space-y-2">
              <input
                value={block.youtubeId}
                onChange={(e) =>
                  updateAt(index, { ...block, youtubeId: e.target.value.trim() })
                }
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                placeholder="ID de YouTube (ej. dQw4w9WgXcQ)"
              />
              <input
                value={block.caption ?? ""}
                onChange={(e) =>
                  updateAt(index, { ...block, caption: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                placeholder="Leyenda (opcional)"
              />
            </div>
          )}

          {block.type === "gallery" && (
            <GalleryBlockEditor
              block={block}
              collection={mediaCollection}
              onChange={(next) => updateAt(index, next)}
            />
          )}

          {block.type === "gallery_ref" && (
            <GalleryRefBlockEditor
              block={block}
              onChange={(next) => updateAt(index, next)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
