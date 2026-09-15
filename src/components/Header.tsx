import type {ReactNode} from 'react';

/**
 * The main header for a DraCor page. Renders as a full-width bar with
 * the DraCor navy background; the child (string or nodes) is rendered
 * as an h1 or passed through unchanged.
 */
export default function Header({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  // `-mx-3.75` bleeds through the 15px page-body gutter added by
  // callers (the ex-`container-fluid` wrapper), matching the way the
  // pre-migration Bootstrap `.row` cancelled `.container-fluid` padding.
  // Drop when the page-body gutter moves off the wrapper (see cleanup
  // option A discussed in the migration).
  const base =
    '-mx-3.75 text-white bg-primary py-4 mb-4 z-[1] flex flex-wrap items-baseline';
  return (
    <header className={`${base} ${className}`}>
      {typeof children === 'string' ? (
        <h1 className="flex-1 px-4 text-5xl leading-none underline decoration-secondary-100 decoration-[0.1em] mb-0">
          {children}
        </h1>
      ) : (
        children
      )}
    </header>
  );
}
