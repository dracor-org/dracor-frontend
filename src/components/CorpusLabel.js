import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import classnames from 'classnames/bind';
import style from './CorpusLabel.module.scss';

const cx = classnames.bind(style);

const CorpusLabel = ({name, title, id}) => {
  return (
    <span className={cx('main')}>
      <Link to={`/${name}`} title={title || 'Corpus'}>
        <em>{name}</em>Dracor
      </Link>
      {id && (
        <span> | <Link to={`/id/${id}`}>{id}</Link></span>
      )}
    </span>
  );
};

CorpusLabel.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  title: PropTypes.string
};

CorpusLabel.defaultProps = {
  id: null,
  title: null
};

export default CorpusLabel;
