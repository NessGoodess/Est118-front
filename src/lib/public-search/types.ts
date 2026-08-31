export type PublicSearchResultType =
  | "page"
  | "section"
  | "announcement"
  | "event"
  | "gallery"
  | "admission"
  | "contact";

export interface PublicSearchResult {
  id: string;
  label: string;
  href: string;
  type: PublicSearchResultType;
  description?: string;
  keywords?: string;
}

export interface PublicSearchItem extends PublicSearchResult {
  searchText: string;
}
