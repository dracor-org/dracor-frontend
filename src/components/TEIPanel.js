import React from 'react';
import PropTypes from 'prop-types';
import CETEI from 'CETEIcean';

import '../CETEIcean.css';
import '../CETEIcean.scss';

const TEIPanel = ({url}) => {
  const CETEIcean = new CETEI();
  CETEIcean.getHTML5(url, (data) => {
    document.querySelector('#TEI').append(data);
  });

  return (
    <div className="tei-frame dracor-scrollbar">
      <div className="ceteicean">
        <div id="TEI" />
      </div>
    </div>
  );
};

TEIPanel.propTypes = {
  url: PropTypes.string.isRequired,
};

export default TEIPanel;
