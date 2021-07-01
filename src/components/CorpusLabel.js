import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import classnames from 'classnames/bind';
import style from './CorpusLabel.module.scss';

const cx = classnames.bind(style);

const CorpusLabel = ({name, title, id}) => {
  return (
    <span className={cx('main')}>
      <Link to={`/${name}`} title={title || 'Corpus'}>
        <em>{name}</em>DraCor
      </Link>
      {id && (
        <span className={cx('dracor-id')}>
          {' | '}
          <CopyToClipboard
            text={`https://dracor.org/id/${id}`}
            title="copy to clipboard"
          >
            <span>{id}</span>
          </CopyToClipboard>
        </span>
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
