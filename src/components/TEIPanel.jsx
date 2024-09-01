import CETEI from 'CETEIcean';

import '../CETEIcean.css';
import '../CETEIcean.scss';

const TEIPanel = ({url}) => {
  const CETEIcean = new CETEI();
  CETEIcean.getHTML5(url, (data) => {
    document.querySelector('#TEI').append(data);
  });

  return (
    <div className="tei-frame">
      <div className="ceteicean dracor-scrollbar">
        <div id="TEI" />
      </div>
    </div>
  );
};

export default TEIPanel;
