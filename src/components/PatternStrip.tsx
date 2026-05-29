// Fixed right-edge brand element — hidden on small screens to prevent overflow
export function PatternStrip() {
  const count = 14;
  return (
    <div
      aria-hidden
      className="fixed right-0 top-0 bottom-0 w-12 overflow-hidden pointer-events-none z-10 hidden sm:flex flex-col justify-center"
    >
      <svg
        width="48"
        height="100%"
        viewBox={`0 0 48 ${count * 28}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: count }).map((_, i) => {
          const offset = (i % 4) * 8;
          const y = i * 28;
          const isGreen = i % 2 === 0;
          const color = isGreen ? "#99CE24" : "#ffffff";
          const opacity = isGreen ? 0.15 : 0.05;
          return (
            <g key={i} transform={`translate(${offset}, ${y})`}>
              <rect x="0" y="0" width="7" height="18" fill={color} opacity={opacity} />
              <rect x="0" y="13" width="18" height="7" fill={color} opacity={opacity} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
