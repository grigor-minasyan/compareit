export const TopCurves = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="transition delay-150 duration-300 ease-in-out"
    viewBox="0 0 1440 320"
  >
    <defs>
      <linearGradient id="a" x1="0%" x2="100%" y1="50%" y2="50%">
        <stop offset="5%" stopColor="#F78DA7" />
        <stop offset="95%" stopColor="#8ED1FC" />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      fillOpacity={0.53}
      d="M0 400V133c55.596 2.192 111.193 4.384 173-2s129.825-21.344 189-11c59.175 10.344 109.508 45.992 171 41 61.492-4.992 134.143-50.625 193-56s103.92 29.508 162 36c58.08 6.492 129.175-15.406 201-23 71.825-7.594 144.378-.884 203 4 58.622 4.884 103.31 7.942 148 11v267Z"
      className="path-0 transition-all delay-150 duration-300 ease-in-out"
      transform="rotate(-180 720 200)"
    />
    <path
      fill="url(#a)"
      d="M0 400V266c59.39 18.263 118.78 36.527 181 39 62.22 2.473 127.27-10.843 181-28 53.73-17.157 96.142-38.155 158-26 61.858 12.155 143.16 57.464 209 60 65.84 2.536 116.215-37.702 167-64 50.785-26.298 101.98-38.657 162-26 60.02 12.657 128.863 50.33 194 62 65.137 11.67 126.569-2.665 188-17v134Z"
      className="path-1 transition-all delay-150 duration-300 ease-in-out"
      transform="rotate(-180 720 200)"
    />
  </svg>
);
