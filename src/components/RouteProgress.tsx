import {useRouterState} from '@tanstack/react-router';

/**
 * Thin bar under the top nav while a route loads.
 *
 * The animation is transform-only on purpose. Rendering a large corpus table
 * blocks the main thread for a while, and compositor-driven transforms keep
 * moving through that; anything driven by JS or by layout properties would
 * freeze exactly when feedback matters most.
 */
export default function RouteProgress() {
  // `isLoading` only covers loaders; `status` stays pending for the rest of
  // the transition, so together they span the whole navigation.
  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.status === 'pending',
  });

  return (
    <div
      className="h-0.75 w-full overflow-hidden bg-primary"
      role="progressbar"
      aria-hidden={!isLoading}
      aria-label={isLoading ? 'Loading page' : undefined}
    >
      {isLoading ? (
        <div className="h-full w-2/5 bg-secondary-100 animate-route-progress motion-reduce:animate-none motion-reduce:w-full motion-reduce:opacity-50" />
      ) : null}
    </div>
  );
}
