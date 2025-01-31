import {useRef, useEffect} from 'react';
import CETEI from 'CETEIcean';

import '../CETEIcean.css';
import '../CETEIcean.scss';

const CETEIcean = new CETEI();

const TEIPanel = ({url}) => {
  const ref = useRef(null);

  useEffect(() => {
    CETEIcean.getHTML5(url, (data) => {
      ref.current.replaceChildren(data);
    });
  }, [url]);

  return (
    <div className="tei-frame">
      <div className="ceteicean dracor-scrollbar">
        <div id="TEI" ref={ref} />
      </div>
    </div>
  );
};

export default TEIPanel;
