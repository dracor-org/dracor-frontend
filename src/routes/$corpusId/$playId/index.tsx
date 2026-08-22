import {createFileRoute, redirect} from '@tanstack/react-router';

export const Route = createFileRoute('/$corpusId/$playId/')({
  beforeLoad: ({params}) => {
    throw redirect({
      to: '/$corpusId/$playId/$tab',
      params: {
        corpusId: params.corpusId,
        playId: params.playId,
        tab: 'network',
      },
      replace: true,
    });
  },
});
