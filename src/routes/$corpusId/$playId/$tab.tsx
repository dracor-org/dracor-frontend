import {createFileRoute, getRouteApi, redirect} from '@tanstack/react-router';
import PlayInfo from '../../../components/Play';

const VALID_TABS = new Set([
  'network',
  'relations',
  'speech',
  'text',
  'downloads',
  'tools',
]);

const parentRouteApi = getRouteApi('/$corpusId/$playId');

export const Route = createFileRoute('/$corpusId/$playId/$tab')({
  beforeLoad: ({params}) => {
    if (!VALID_TABS.has(params.tab)) {
      throw redirect({
        to: '/$corpusId/$playId/$tab',
        params: {
          corpusId: params.corpusId,
          playId: params.playId,
          tab: 'network',
        },
        replace: true,
      });
    }
  },
  component: PlayTabRoute,
});

function PlayTabRoute() {
  const {tab} = Route.useParams();
  const {play, metrics} = parentRouteApi.useLoaderData();
  return <PlayInfo play={play} metrics={metrics} tab={tab} />;
}
