import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './SourceInfo.module.scss';

const cx = classnames.bind(style);

const SourceInfo = ({source, original}) => {
  return (
    <div className={cx('main')}>
      {source && (
        <p>
          Full text originally obtained from{' '}
          {source.url ? (
            <a target="_blank" rel="noopener noreferrer" href={source.url}>
              {source.name}
            </a>
          ) : (
            source.name
          )}. TEI adaptation, corrections, enhancements by DraCor.
        </p>
      )}

      {original && (
        <p>Direct print source: <em>{original}</em></p>
      )}
    </div>
  );
};

SourceInfo.propTypes = {
  source: PropTypes.object,
  original: PropTypes.string
};

export default SourceInfo;
