/** Cat head, the app's mark. Same drawing as public/favicon.svg, in the current text colour. */
export function CatIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M10 54V14l14 12c2.5-1 5.2-1.5 8-1.5s5.5.5 8 1.5l14-12v40c0 3-2 5-5 5H15c-3 0-5-2-5-5z"
        fill="#F08C00"
      />
      <circle cx="23" cy="38" r="4" fill="currentColor" />
      <circle cx="41" cy="38" r="4" fill="currentColor" />
      <path d="M29 46h6l-3 3.5z" fill="currentColor" />
      <path
        d="M4 44l12 1M4 50l12-1M60 44l-12 1M60 50l-12-1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
