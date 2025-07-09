export function CourtLines() {
  return (
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="court-lines" x="0" y="0" width="400" height="300" patternUnits="userSpaceOnUse">
            {/* Court outline */}
            <rect width="400" height="300" fill="none" stroke="#d97706" strokeWidth="2" />

            {/* Center circle */}
            <circle cx="200" cy="150" r="60" fill="none" stroke="#d97706" strokeWidth="2" />
            <circle cx="200" cy="150" r="20" fill="none" stroke="#d97706" strokeWidth="1" />

            {/* Center line */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="#d97706" strokeWidth="2" />

            {/* Free throw circles */}
            <circle cx="100" cy="150" r="40" fill="none" stroke="#d97706" strokeWidth="1" />
            <circle cx="300" cy="150" r="40" fill="none" stroke="#d97706" strokeWidth="1" />

            {/* Three point lines */}
            <path d="M 50,50 A 120,120 0 0 1 50,250" fill="none" stroke="#d97706" strokeWidth="1" />
            <path d="M 350,50 A 120,120 0 0 0 350,250" fill="none" stroke="#d97706" strokeWidth="1" />

            {/* Key areas */}
            <rect x="0" y="100" width="80" height="100" fill="none" stroke="#d97706" strokeWidth="1" />
            <rect x="320" y="100" width="80" height="100" fill="none" stroke="#d97706" strokeWidth="1" />

            {/* Backboards */}
            <line x1="10" y1="130" x2="10" y2="170" stroke="#d97706" strokeWidth="3" />
            <line x1="390" y1="130" x2="390" y2="170" stroke="#d97706" strokeWidth="3" />

            {/* Hoops */}
            <circle cx="20" cy="150" r="5" fill="none" stroke="#d97706" strokeWidth="1" />
            <circle cx="380" cy="150" r="5" fill="none" stroke="#d97706" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#court-lines)" />
      </svg>
    </div>
  )
}
