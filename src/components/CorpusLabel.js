import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import classnames from 'classnames/bind';
import style from './CorpusLabel.module.scss';

const cx = classnames.bind(style);

const CorpusLabel = ({name, title, acronym}) => {
  const prefix = acronym
    ? acronym.replace('DraCor', '')
    : name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <span className={cx('main')}>
      <Link to={`/${name}`} title={title || 'Corpus'}>
        <em>{prefix}</em>DraCor
      </Link>
    </span>
  );
};

CorpusLabel.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  acronym: PropTypes.string,
};

CorpusLabel.defaultProps = {
  title: null,
  acronym: null,
};

export default CorpusLabel;
