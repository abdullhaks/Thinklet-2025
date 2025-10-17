export const GridBackground = () => (
  <div className="absolute inset-0 opacity-50 z-0 overflow-hidden">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40 M 0 0 L 40 0 M 0 0 L 0 40"
            fill="none"
            stroke="rgba(167, 139, 250, 0.3)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <div
      className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
      style={{ zIndex: -1 }}
    ></div>
    <div
      className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
      style={{ zIndex: -1, animationDelay: "1s" }}
    ></div>
  </div>
);
