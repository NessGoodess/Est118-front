import HeroWelcome from '@/components/public/hero/HeroWelcomeDefinitive';
import NoticiasSection from '@/components/public/sections/NoticiasSection';
import EventosSection from '@/components/public/sections/EventosSection';
import GaleriaSection from '@/components/public/sections/GaleriaSection';
import UbicacionSection from '@/components/public/sections/UbicacionSection';

export default function Home() {
  return (
    <div className=''>
      <HeroWelcome />
      <NoticiasSection />
      <EventosSection />
      <GaleriaSection />
      <UbicacionSection />
    </div>
  );
}
