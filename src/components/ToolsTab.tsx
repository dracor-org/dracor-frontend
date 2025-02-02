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
  const [textType, setTextType] = useState<'spoken-text' | 'stage-directions'>(
    'spoken-text'
  );
  const apiBase = new URL(apiUrl, window.location.href);

  const endpoint = encodeURIComponent(
    `${apiBase.href}/corpora/${corpusId}/plays/${playId}/${textType}`
  );

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
                href={`https://voyant-tools.org/?input=${endpoint}`}
                target="_blank"
              >
                Voyant Tools
              </a>
            </li>
            <li>
              <a
                href={`https://switchboard.clarin.eu/#/vlo/${endpoint}`}
                target="_blank"
              >
                CLARIN Language Resource Switchboard
              </a>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
