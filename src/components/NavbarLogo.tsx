export default function NavbarLogo() {
  return (
    <header className="site-banner w-full shadow-md">
      <div className="relative grid h-[120px] w-full grid-cols-[minmax(7rem,auto)_1fr_minmax(7rem,auto)] items-center gap-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-4 sm:px-8">
        <div
          className="relative mx-auto h-[88px] w-[7.5rem] shrink-0 overflow-hidden sm:mx-0 sm:w-[9rem]"
          aria-hidden
        >
          <svg
            viewBox="0 0 80 52"
            className="primitive-bike absolute inset-0 h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="woodGrainBanner"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>

            <g className="primitive-bike__wheel primitive-bike__wheel--back">
              <path
                d="M15 36 C9.5 36 5 31.5 5 26 C5 20.5 9.5 16 15 16 C18 16 20.5 17.5 22 20 C23 18 25 16.5 27.5 16.5 C31 16.5 34 19.5 34 24 C34 28.5 31 32 27 33.5 C24.5 35.5 20 36 15 36 Z"
                fill="#a1a1aa"
                stroke="#52525b"
                strokeWidth="1.3"
              />
              <path
                d="M11 24 L14 27 M17 19 L19 24 M10 30 L13 32 M22 22 L24 26"
                stroke="#3f3f46"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>

            <g className="primitive-bike__wheel primitive-bike__wheel--front">
              <path
                d="M57 36 C51.5 36 47 31.5 47 26 C47 20.5 51.5 16 57 16 C60 16 62.5 17.5 64 20 C65.5 17 68.5 15.5 72 15.5 C75.5 15.5 78.5 19 78.5 24.5 C78.5 29 75.5 32.5 71 34 C68 35.5 62.5 36 57 36 Z"
                fill="#9ca3af"
                stroke="#4b5563"
                strokeWidth="1.3"
              />
              <path
                d="M53 23 L56 26 M59 18 L61 23 M52 29 L55 31 M64 21 L66 25"
                stroke="#374151"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>

            <path
              d="M22 30 L40 13 L58 30"
              stroke="url(#woodGrainBanner)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M40 13 L40 6"
              stroke="#78350f"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M40 6 L48 4"
              stroke="#a16207"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M32 20 L22 30"
              stroke="#92400e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M48 20 L58 30"
              stroke="#92400e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M34 12 L46 12"
              stroke="#d97706"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M26 24 L30 28 M50 24 L54 28"
              stroke="#713f12"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>

        <a
          href="/"
          className="text-center no-underline"
          aria-label="Web Bikes Brasil.com — página inicial"
        >
          <h1 className="m-0 text-2xl font-extrabold tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl">
            <span className="text-white">Web Bikes </span>
            <span className="text-blue-950">Brasil.com</span>
          </h1>
        </a>

        <a
          href="/planos"
          className="advertise-badge mx-auto shrink-0 rounded-lg border-2 border-yellow-400 bg-blue-950 px-3 py-2 text-xs font-bold text-yellow-100 no-underline sm:mx-0 sm:px-4 sm:text-sm"
        >
          Anuncie aqui!
        </a>
      </div>
    </header>
  );
}
