import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import classnames from 'classnames/bind';
import style from './CorpusLabel.module.scss';

const cx = classnames.bind(style);

const CorpusLabel = ({name, title}) => {
  return (
    <span className={cx('main')}>
      <Link to={`/${name}`} title={title || 'Corpus'}>
        <em>{name}</em>DraCor
      </Link>
    </span>
  );
};

CorpusLabel.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string
};

CorpusLabel.defaultProps = {
  title: null
};

export default CorpusLabel;
