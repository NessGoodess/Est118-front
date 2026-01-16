export default function CurvedLayers() {
    return (
      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="w-full h-[260px]"
        >
          {/* Capa roja (inferior) */}
          <path
            fill="#dc2626"
            d="
              M0,240
              C240,340 480,340 720,300
              960,260 1200,240 1440,220
              L1440,400
              L0,400
              Z
            "
          />
  
          {/* Capa azul (media) */}
          <path
            fill="#4f9db8"
            d="
              M0,260
              C240,300 480,300 720,260
              960,220 1200,200 1440,180
              L1440,400
              L0,400
              Z
            "
          />
  
          {/* Capa amarilla (superior) */}
          <path
            fill="#ffc35c"
            d="
              M0,280
              C240,260 480,260 720,220
              960,180 1200,140 1440,100
              L1440,400
              L0,400
              Z
            "
          />
        </svg>
      </div>
    );
  }
  