const LogoSvg = (props) => (
  <svg
    width="500"
    height="200"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M100 30 
       C120 30, 140 70, 100 160 
       C60 70, 80 30, 100 30 Z"
      fill="none"
      stroke="#1D4ED8"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle cx="100" cy="90" r="14" fill="#1D4ED8" />

    <text
      x="100"
      y="190"
      fontFamily="Arial, sans-serif"
      fontSize="22"
      fill="#1D4ED8"
      textAnchor="middle"
    >
      My Travel Log
    </text>
  </svg>
);

export default LogoSvg;
