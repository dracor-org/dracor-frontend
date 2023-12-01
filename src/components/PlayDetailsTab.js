import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './PlayDetailsTab.module.scss';

const cx = classnames.bind(style);

const PlayDetailsTab = ({
  children,
  description,
  characters,
  metrics,
  segments,
}) => {
  return (
    <div className={cx('main')}>
      <div className={cx('content')}>{children}</div>
      <div className={cx('description')}>{description}</div>
      {metrics && <div className={cx('metrics')}>{metrics}</div>}
      {characters && <div className={cx('characters')}>{characters}</div>}
      {segments && <div className={cx('segments')}>{segments}</div>}
    </div>
  );
};

PlayDetailsTab.propTypes = {
  characters: PropTypes.element,
  description: PropTypes.element,
  metrics: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

PlayDetailsTab.defaultProps = {
  characters: null,
};

export default PlayDetailsTab;
