import HeroWelcome from '@/components/public/hero/HeroWelcomeDefinitive';
import NoticiasSection from '@/components/public/sections/NoticiasSection';
import EventosSection from '@/components/public/sections/EventosSection';
import GaleriaSection from '@/components/public/sections/GaleriaSection';
import UbicacionSection from '@/components/public/sections/UbicacionSection';
import CircularesSection from '@/components/public/sections/CircularesSection';
import BoletasSection from '@/components/public/sections/BoletasSection';
import CalendarioSection from '@/components/public/sections/CalendarioSection';
import FormatosSection from '@/components/public/sections/FormatosSection';
import ConstanciasSection from '@/components/public/sections/ConstanciasSection';
import AvisosSection from '@/components/public/sections/AvisosSection';

export default function Home() {
  return (
    <div className=''>
      <HeroWelcome />
      <NoticiasSection />
      <EventosSection />
      <GaleriaSection />

      {/* Student Services Sections 
      <CircularesSection />
      <BoletasSection />
      <CalendarioSection />
      <FormatosSection />
      <ConstanciasSection />
      <AvisosSection />
*/}
      <UbicacionSection />
    </div>
  );
}
