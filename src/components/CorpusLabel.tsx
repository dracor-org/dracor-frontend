import {Link} from '@tanstack/react-router';

interface Props {
  name: string;
  title?: string;
  acronym?: string;
}

export default function CorpusLabel({name, title, acronym}: Props) {
  const prefix = acronym
    ? acronym.replace('DraCor', '')
    : name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <span className="inline-flex bg-white text-primary rounded-md text-lg font-medium py-0.5 pr-1 pl-0.5">
      <Link
        to="/$corpusId"
        params={{corpusId: name}}
        title={title || 'Corpus'}
        className="text-primary hover:no-underline flex leading-tight"
      >
        <em className="bg-primary text-white rounded px-1 mr-0.5 font-normal not-italic capitalize hover:bg-secondary-200">
          {prefix}
        </em>
        DraCor
      </Link>
    </span>
  );
}
