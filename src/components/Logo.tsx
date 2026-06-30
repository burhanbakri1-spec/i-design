'use client';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`logo cursor-pointer transition-opacity duration-500 opacity-100 group ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="biglogo"
        viewBox="0 0 216 98"
        className="pointer-events-none size-full"
      >
        <polyline
          className="stroke letter-b-1 stroke-black"
          points="9.82 78.44 9.82 9.82 49.04 9.82 49.04 39.27"
        />
        <polyline
          className="stroke letter-b-2 stroke-black"
          points="68.67,78.44 68.67,49.04 19.63,49.04"
        />
        <line
          className="stroke letter-b-3 stroke-black"
          x1="0" y1="88.26" x2="215.7" y2="88.26"
        />
        <line
          className="stroke letter-i stroke-black"
          x1="107.895" y1="0" x2="107.895" y2="98.08"
          strokeWidth="19.63"
        />
        <line
          className="stroke letter-i-2 stroke-black"
          x1="0" y1="49" x2="215.7" y2="49"
        />
        <line
          className="stroke letter-g-1 stroke-black"
          x1="0" y1="9.82" x2="215.7" y2="9.82"
        />
        <polyline
          className="stroke letter-g-2 stroke-black"
          points="147.07,19.63 147.07,88.26 205.88,88.26 205.88,49.04 176.52,49.04"
        />
      </svg>
    </div>
  );
}
