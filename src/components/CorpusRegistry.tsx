import corpora, {RegistryCorpusInfo} from '@dracor/registry';
import ReactMarkdown from 'react-markdown';
import Header from './Header';

function renderCorpus({
  name,
  title,
  repository,
  license,
  status,
  description,
}: RegistryCorpusInfo) {
  let corpusUrl;
  switch (status) {
    case 'published':
      corpusUrl = `https://dracor.org/${name}`;
      break;
    case 'draft':
      corpusUrl = `https://staging.dracor.org/${name}`;
      break;
  }
  return (
    <li key={name}>
      <strong>
        {corpusUrl ? <a href={corpusUrl}>{title}</a> : <span>{title}</span>}
      </strong>
      <br />
      <a href={repository}>{repository}</a>
      {license && (
        <>
          <br />
          License: <a href={license.url}>{license.name}</a>
        </>
      )}
      {description && <ReactMarkdown>{description}</ReactMarkdown>}
    </li>
  );
}

export default function CorpusRegistry() {
  const published = corpora.filter(({status}) => status === 'published');
  const drafts = corpora.filter(({status}) => status === 'draft');
  const proposed = corpora.filter(({status}) => status === 'proposed');

  return (
    <div className="container-fluid">
      <div className="dracor-page">
        <title>Corpus Registry - DraCor</title>
        <Header>DraCor Corpora</Header>
        <h2>Published ({published.length})</h2>
        <p>The following corpora are available on dracor.org.</p>
        <ul>{published.map(renderCorpus)}</ul>
        <h2>Drafted ({drafts.length})</h2>
        <p>The following corpora are available on staging.dracor.org.</p>
        <ul>{drafts.map(renderCorpus)}</ul>
        <h2>Proposed ({proposed.length})</h2>
        <p>
          The following corpora are planned but may not be publicly available
          yet.
        </p>
        <ul>{proposed.map(renderCorpus)}</ul>
      </div>
    </div>
  );
}
