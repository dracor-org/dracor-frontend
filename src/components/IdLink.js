import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './IdLink.module.scss';

const cx = classnames.bind(style);

const types = {
  isni: {
    label: 'ISNI',
    url: 'https://isni.org/isni/',
  },
  pnd: {
    label: 'PND',
    url: 'https://d-nb.info/gnd/',
  },
  wikidata: {
    label: 'Wikidata',
    url: 'https://www.wikidata.org/wiki/',
  },
};

const IdLink = ({button, children, className, showLabel}) => {
  const mainClass = cx(className, 'main', {button});

  const matches = children.match(/^(wikidata|pnd|isni):([a-z\d]+)$/i);
  if (!matches) {
    return <span className={mainClass}>{children}</span>;
  }

  const type = matches[1].toLowerCase();
  const id = matches[2];
  const {url, label} = types[type];

  return (
    <span className={mainClass}>
      {showLabel && `${label}: `}
      <a className={cx(type)} href={`${url}${id}`} title={label}>
        {id}
      </a>
    </span>
  );
};

IdLink.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  button: PropTypes.bool,
  showLabel: PropTypes.bool,
};

IdLink.defaultProps = {
  button: false,
  className: '',
  showLabel: false,
};

export default IdLink;
