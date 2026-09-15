import {createFileRoute} from '@tanstack/react-router';
import APIDoc from '../../components/APIDoc';

export const Route = createFileRoute('/doc/api')({
  component: () => <APIDoc mode="current" />,
});
