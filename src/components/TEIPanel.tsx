import {TEIText} from '@dracor/react';
import './TEIPanel.css';

interface Props {
  url: string;
}

export default function TEIPanel({url}: Props) {
  return (
    <div className="tei-frame">
      <div className="ceteicean dracor-scrollbar">
        <TEIText url={url} />
      </div>
    </div>
  );
}
