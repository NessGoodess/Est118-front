// Public
export { default as AnnouncementsSection } from "./public/AnnouncementsSection"
export { default as AnnouncementsList } from "./public/AnnouncementsList"
export { default as AnnouncementDetailContent } from "./public/DetailContent"
export { default as FacebookComments } from "./public/FacebookComments"
export { default as FacebookPostEmbed } from "./public/FacebookPostEmbed"
export { default as HomeAnnouncements } from "./public/HomeAnnouncements"
export { default as AnnouncementsSectionSkeleton } from "./public/skeletons/AnnouncementsSectionSkeleton"
export { default as AnnouncementsListSkeleton } from "./public/skeletons/AnnouncementsListSkeleton"
export { default as AnnouncementDetailSkeleton } from "./public/skeletons/AnnouncementDetailSkeleton"

// Shared
export { default as BrandPageHero } from "./shared/BrandPageHero"
export { default as AnnouncementDetailHero } from "./public/AnnouncementDetailHero"
export { default as FacebookShareButton } from "./shared/FacebookShareButton"

// Private / admin
export { default as AnnouncementForm } from "./components/form/AnnouncementForm"
export { default as AdminAnnouncementsList } from "./components/list/announcements-list"
export { default as ContentBlocksEditor } from "./components/form/AnnouncementForm/ContentBlocksEditor"
export { default as AnnouncementFormGuide } from "./components/form/AnnouncementForm/Guide"
export { default as AnnouncementLivePreview } from "./components/form/AnnouncementForm/LivePreview"
export { default as AnnouncementPreviewModal } from "./components/form/AnnouncementForm/PreviewModal"
export { default as AdminAnnouncementsListSkeleton } from "./components/skeletons/AdminAnnouncementsListSkeleton"
export { default as AnnouncementFormSkeleton } from "./components/skeletons/AnnouncementFormSkeleton"

// Data
export {
  getAnnouncementsExtended,
  getAnnouncementExtendedByIdOrSlug,
  getHomeAnnouncements,
} from "./lib/announcements-data"
export {
  getAnnouncementPublicUrl,
  getAnnouncementPublicPath,
  openFacebookShare,
  resolvePublicOrigin,
} from "./lib/urls"

// Services
export {
  getAnnouncements,
  getPublicAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type AnnouncementRawItem,
} from "./services/announcements.service"

// Validations
export {
  announcementSchema,
  ANNOUNCEMENT_FORM_DEFAULTS,
  ANNOUNCEMENT_TYPES,
  type AnnouncementFormValues,
} from "./validations/announcement.schema"

// Types
export type {
  AnnouncementExtended,
  AnnouncementCardData,
  AnnouncementContentBlock,
  AnnouncementMedia,
} from "./types/announcement"
