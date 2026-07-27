// components/ui/LoadingIcon.tsx
import Image from 'next/image';

interface LoadingIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingIcon({ 
  size = 'md', 
  className = '' 
}: LoadingIconProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  return (
    <div className={`h-dvh flex items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src="/logo.PNG"
          alt="Cargando..."
          fill
          priority
          className="object-contain animate-pulse"
          sizes={`(max-width: 768px) ${size === 'sm' ? '48px' : size === 'md' ? '80px' : '112px'}`}
        />
      </div>
    </div>
  );
}