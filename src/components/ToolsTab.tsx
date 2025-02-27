import {useState} from 'react';
import classnames from 'classnames/bind';
import style from './ToolsTab.module.scss';
import {apiUrl} from '../config';

const cx = classnames.bind(style);

interface Props {
  corpusId: string;
  playId: string;
}

export default function ToolsTab({corpusId, playId}: Props) {
  const [textType, setTextType] = useState<
    'tei' | 'spoken-text' | 'stage-directions'
  >('tei');
  const apiBase = new URL(apiUrl, window.location.href);

  const urlBase = `${apiBase.href}/corpora/${corpusId}/plays/${playId}`;
  const textUrl = encodeURIComponent(`${urlBase}/${textType}`);
  const gexfUrl = encodeURIComponent(`${urlBase}/networkdata/gexf`);

  const isAccessible = /dracor\.org/.test(apiBase.hostname);

  return (
    <div className={cx('main')}>
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
          <p className={cx('select')}>
            Text layer for analysis:{' '}
            <label onClick={() => setTextType('tei')}>
              <input type="radio" checked={textType === 'tei'} /> Full text
              (TEI-encoded)
            </label>{' '}
            <label onClick={() => setTextType('spoken-text')}>
              <input type="radio" checked={textType === 'spoken-text'} /> Spoken
              text
            </label>{' '}
            <label onClick={() => setTextType('stage-directions')}>
              <input type="radio" checked={textType === 'stage-directions'} />{' '}
              Stage directions
            </label>
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
