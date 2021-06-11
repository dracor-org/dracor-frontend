import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './SourceInfo.module.scss';

const cx = classnames.bind(style);

const SourceInfo = ({source, original}) => {
  return (
    <div className={cx('main')}>
      {source && (
        <>
          <h4>Source</h4>
          <p>
            {source.url ? (
              <a target="_blank" rel="noopener noreferrer" href={source.url}>
                {source.name}
              </a>
            ) : (
              source.name
            )}
          </p>
        </>
      )}

      {original && (
        <>
          <h4>Original Source</h4>
          <p>{original}</p>
        </>
      )}
    </div>
  );
};

SourceInfo.propTypes = {
  source: PropTypes.object,
  original: PropTypes.string
};

export default SourceInfo;
