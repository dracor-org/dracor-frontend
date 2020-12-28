import React from 'react';
import PropTypes from 'prop-types';

const types = {
  isni: {
    label: 'ISNI',
    url: 'https://isni.org/isni/'
  },
  pnd: {
    label: 'PND',
    url: 'https://d-nb.info/gnd/'
  },
  wikidata: {
    label: 'Wikidata',
    url: 'https://www.wikidata.org/wiki/'
  }
};

const IdLink = ({children, showLabel}) => {
  const matches = children.match(/^(wikidata|pnd|isni):([a-z\d]+)$/i);
  if (!matches) {
    return <span>{children}</span>;
  }

  const type = matches[1].toLowerCase();
  const id = matches[2];
  const {url, label} = types[type];
  return (
    <span>
      {showLabel && `${label}: `}
      <a href={`${url}${id}`} title={label}>{id}</a>
    </span>
  );
};

IdLink.propTypes = {
  children: PropTypes.string.isRequired,
  showLabel: PropTypes.bool
};

IdLink.defaultProps = {
  showLabel: false
};

export default IdLink;
