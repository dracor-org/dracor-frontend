import {use, useState} from 'react';
import {compareVersions} from 'compare-versions';
import {DracorContext} from '../context';
import {apiUrl} from '../config';

interface Props {
  corpusId: string;
  playId: string;
}

function Radio({
  checked,
  onSelect,
  children,
}: {
  checked: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="inline-block ml-2" onClick={onSelect}>
      <input
        type="radio"
        checked={checked}
        readOnly
        className="mr-1 align-middle appearance-auto accent-primary"
      />{' '}
      {children}
    </label>
  );
}

export default function ToolsTab({corpusId, playId}: Props) {
  const {apiInfo} = use(DracorContext);
  const [textType, setTextType] = useState<
    'tei' | 'txt' | 'spoken-text' | 'stage-directions'
  >('tei');
  const apiBase = new URL(apiUrl, window.location.href);

  const urlBase = `${apiBase.href}/corpora/${corpusId}/plays/${playId}`;
  const textUrl = encodeURIComponent(`${urlBase}/${textType}`);
  const gexfUrl = encodeURIComponent(`${urlBase}/networkdata/gexf`);

  const isAccessible = /dracor\.org/.test(apiBase.hostname);

  return (
    <div>
      <h1>External Tools</h1>

      {!isAccessible && (
        <p>
          The connected <a href={apiBase.href}>DraCor API</a> does not seem to
          be publicly accessible. The external tools need to be able to access
          the respective endpoints of the API.
        </p>
      )}

      {isAccessible && (
        <>
          <p>
            Text layer for analysis:{' '}
            <Radio
              checked={textType === 'tei'}
              onSelect={() => setTextType('tei')}
            >
              Full text (TEI-encoded)
            </Radio>{' '}
            {apiInfo &&
              compareVersions(apiInfo.version, '1.1.0-beta.7') >= 0 && (
                <Radio
                  checked={textType === 'txt'}
                  onSelect={() => setTextType('txt')}
                >
                  Plain text
                </Radio>
              )}
            <Radio
              checked={textType === 'spoken-text'}
              onSelect={() => setTextType('spoken-text')}
            >
              Spoken text
            </Radio>{' '}
            <Radio
              checked={textType === 'stage-directions'}
              onSelect={() => setTextType('stage-directions')}
            >
              Stage directions
            </Radio>
          </p>
          <ul>
            <li>
              <a
                href={`https://voyant-tools.org/?input=${textUrl}`}
                target="_blank"
              >
                Voyant Tools
              </a>
            </li>
            <li>
              <a
                href={`https://switchboard.clarin.eu/#/vlo/${textUrl}`}
                target="_blank"
              >
                CLARIN Language Resource Switchboard
              </a>
            </li>
          </ul>
          <p>Network analysis</p>
          <ul>
            <li>
              <a
                href={`https://gephi.org/gephi-lite/?file=${gexfUrl}`}
                target="_blank"
              >
                Gephi Lite
              </a>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
