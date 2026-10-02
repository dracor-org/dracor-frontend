interface Props {
  source?: {
    name: string;
    url: string;
  };
  original?: string;
}

export default function SourceInfo({source, original}: Props) {
  return (
    <div>
      {source && (
        <p>
          Full text originally obtained from{' '}
          {source.url ? (
            <a target="_blank" rel="noopener noreferrer" href={source.url}>
              {source.name}
            </a>
          ) : (
            source.name
          )}
          . TEI adaptation, corrections, enhancements by DraCor.
        </p>
      )}

      {original && (
        <p>
          Direct print source: <em>{original}</em>
        </p>
      )}
    </div>
  );
}
