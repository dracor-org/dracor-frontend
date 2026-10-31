import logo from '../images/DraCor-white.svg';

/**
 * Stand-in for the app shell while the root loader fetches `/info` and
 * `/corpora`.
 *
 * It paints its own page background on purpose. `body` is navy with a light
 * bottom half (see `index.css`), so a bare top bar in `--color-primary`
 * disappears into it and all that's left is the 3px progress line.
 *
 * This deliberately mirrors the markup inlined in `index.html`: that one
 * covers the window before React mounts, this one the window after React
 * mounts but before the root route has data. Keep the two in step.
 */
export default function AppSkeleton() {
  return (
    <div
      className="min-h-screen bg-neutral-100"
      aria-busy="true"
      aria-label="Loading DraCor"
    >
      <div className="flex items-center p-4 bg-primary">
        <img src={logo} alt="" className="h-12 w-12" />
      </div>
      <div className="h-0.75 w-full overflow-hidden bg-primary">
        <div className="h-full w-2/5 bg-secondary-100 animate-route-progress motion-reduce:animate-none motion-reduce:w-full motion-reduce:opacity-50" />
      </div>

      {/* Placeholder for the corpus-card grid, so the wait has some shape. */}
      <div className="flex flex-row flex-wrap justify-center gap-4 px-4 pt-10">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-full md:w-96 h-124 rounded-xl bg-white/60 shadow-lg animate-pulse motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}
