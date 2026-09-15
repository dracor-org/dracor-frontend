import {createFileRoute} from '@tanstack/react-router';
import CorpusRegistry from '../../components/CorpusRegistry';

export const Route = createFileRoute('/doc/corpora')({
  component: CorpusRegistry,
});
