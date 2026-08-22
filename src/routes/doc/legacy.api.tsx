import {createFileRoute, notFound} from '@tanstack/react-router';
import APIDoc from '../../components/APIDoc';
import {legacyApiUrl} from '../../config';

export const Route = createFileRoute('/doc/legacy/api')({
  beforeLoad: () => {
    if (!legacyApiUrl) throw notFound();
  },
  component: () => <APIDoc mode="legacy" />,
});
