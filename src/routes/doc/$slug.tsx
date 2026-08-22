import {createFileRoute} from '@tanstack/react-router';
import {fetchDocMarkdown} from '../../loaders';
import DocPage from '../../components/DocPage';

export const Route = createFileRoute('/doc/$slug')({
  loader: ({params}) => fetchDocMarkdown(params.slug),
  component: DocRoute,
});

function DocRoute() {
  const {markdown, title} = Route.useLoaderData();
  return <DocPage markdown={markdown} title={title} />;
}
