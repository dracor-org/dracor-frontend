import {createFileRoute} from '@tanstack/react-router';
import OddPage from '../../components/OddPage';

export const Route = createFileRoute('/doc/odd')({
  component: OddPage,
});
