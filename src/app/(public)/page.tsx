import HeroWelcome from '@/components/public/hero/HeroWelcomeDefinitive';
import NoticiasSection from '@/components/public/sections/NoticiasSection';
import UbicacionSection from '@/components/public/sections/UbicacionSection';
import AnnouncementsHeroSection from '@/components/public/sections/Announcements/AnnouncementsSection';
import { getAnnouncementsExtended } from '@/lib/data/announcementsExtended';

export default async function Home() {
  const [announcements] = await Promise.all([

    getAnnouncementsExtended(),
  ])
  return (
    <div className=''>
      <HeroWelcome />
      <AnnouncementsHeroSection Announcements={announcements} />
      <NoticiasSection />
      <UbicacionSection />
    </div>
  );
}
