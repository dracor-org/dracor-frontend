import {createFileRoute, notFound, Outlet} from '@tanstack/react-router';
import {fetchPlay, fetchPlayMetrics, isNotFound} from '../../../loaders';

export const Route = createFileRoute('/$corpusId/$playId')({
  loader: async ({params}) => {
    try {
      const [play, metrics] = await Promise.all([
        fetchPlay(params.corpusId, params.playId),
        fetchPlayMetrics(params.corpusId, params.playId).catch((error) => {
          if (isNotFound(error)) return undefined;
          throw error;
        }),
      ]);
      return {play, metrics};
    } catch (error) {
      if (isNotFound(error)) throw notFound();
      throw error;
    }
  },
  notFoundComponent: () => <p>No such play!</p>,
  component: PlayLayoutRoute,
});

function PlayLayoutRoute() {
  return (
    <div style={{height: '100%'}}>
      <Outlet />
    </div>
  );
}
