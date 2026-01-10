export default function PalettePreview() {
  const colors = [
    { name: "level-1  #2d469b", className: "bg-[#2d469b] text-white" },
    { name: "level-2  #222859", className: "bg-[#222859] text-white" },
    { name: "level-3  #181d49", className: "bg-[#181d49] text-white" },
    { name: "blue  #3719ca", className: "bg-[#3719ca] text-white" },
    { name: "torquoise  #007ebb", className: "bg-[#007ebb] text-white" },
    { name: "heavy-blue  #000D44", className: "bg-[#000D44] text-white" },
    { name: "heavy-blue2  #4896b4", className: "bg-[#4896b4] text-black" },
    { name: "amarillo  #ffbd59", className: "bg-[#ffbd59] text-black" },
    { name: "rojito  #db4444", className: "bg-[#db4444] text-white" },
  ];

  return (
    <div>
      {colors.map((c) => (
        <div
          key={c.name}
          className={`
            ${c.className}
            min-h-screen
            flex
            flex-col
            items-center
            justify-center
            text-4xl
            font-bold
          `}
        >
          <div>{c.name}</div>
          <div className="text-base mt-4 opacity-80">
            Texto de ejemplo para contraste
          </div>
        </div>
      ))}
    </div>
  );
}
