'use client';
import React, { useEffect, useState } from 'react';
import { getAnnouncements, AnnouncementRawItem } from '@/lib/services/announcements.service';
import AnnouncementsList from '@/components/private/announcements/announcements-list';

export default function AnnouncementsListPage() {
  const [data, setData] = useState<AnnouncementRawItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getAnnouncements();
        setData(result);
      } catch {
        setError(true);
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center bg-danger/10 text-danger rounded-xl my-8">
        No se pudieron cargar los avisos. Por favor, intenta de nuevo más tarde.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-fg-muted">
        <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <AnnouncementsList data={data} />
    </div>
  );
}
