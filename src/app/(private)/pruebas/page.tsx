'use client';

import { useRef } from 'react';

export default function FullscreenDiv() {
  const divRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      divRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <button onClick={toggleFullscreen} className='color-red bg-blue-200'>
        toggle fullscreen
      </button>

      <div ref={divRef} className='bg-white full-h-screen'>
        div normal
      </div>
    </>
  );
}
