import apiClient, {
  handleApiError,
  API_ENDPOINTS,
  buildApiUrl,
} from '@/lib/api';

// For typing purposes, although the backend returns a flat model, 
// the List uses whatever is returned via the index endpoint.
export interface AnnouncementRawItem {
    id: number;
    title: string;
    type: string;
    author?: string | null;
    published_at?: string | null;
    created_at: string;
    important: boolean;
    header?: string | null;
    slug?: string | null;
    summary?: string | null;
    media_type: "image" | "video" | "youtube";
    // Full API shape fields
    header_alert_enabled: boolean;
    header_alert_label?: string | null;
    content_type: "text" | "list";
    content_text?: string | null;
    content_items?: string[] | null;
    secondary_button_enabled: boolean;
    secondary_button_label?: string | null;
    secondary_button_href?: string | null;
    media_src?: string | null;
    media_youtube_id?: string | null;
    media_alt: string;
    media_ratio: "4/3" | "3/4" | "4/4";
    content_blocks?: import("@/components/public/sections/Announcements/Announcement-extended.types").AnnouncementContentBlock[] | null;
}

/**
 * Get all announcements (Admin - Axios)
 */
export async function getAnnouncements(): Promise<AnnouncementRawItem[]> {
    try {
        const response = await apiClient.get<AnnouncementRawItem[]>(
            API_ENDPOINTS.ANNOUNCEMENTS.GET_ALL,
            { params: { manage: true } }
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Get all announcements (Public - Fetch for Next.js caching)
 */
export async function getPublicAnnouncements(): Promise<AnnouncementRawItem[]> {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.ANNOUNCEMENTS.GET_ALL), {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch public announcements");
    }

    return response.json();
}

/**
 * Get a single announcement by ID
 */
export async function getAnnouncement(id: number | string): Promise<Record<string, unknown>> {
    try {
        const response = await apiClient.get(
            API_ENDPOINTS.ANNOUNCEMENTS.GET_ONE(id),
            { params: { manage: true } }
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(formData: FormData): Promise<AnnouncementRawItem> {
    try {
        const response = await apiClient.post<AnnouncementRawItem>(
            API_ENDPOINTS.ANNOUNCEMENTS.CREATE,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Update an announcement
 */
export async function updateAnnouncement(id: number | string, formData: FormData): Promise<AnnouncementRawItem> {
    try {
        // Laravel handles PUT/PATCH with files best by using POST + _method field
        formData.append('_method', 'PATCH');
        const response = await apiClient.post<AnnouncementRawItem>(
            API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(id),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(id: number | string): Promise<void> {
    try {
        await apiClient.delete(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(id));
    } catch (error) {
        throw handleApiError(error);
    }
}

