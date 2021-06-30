import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './PlayDetailsTab.module.scss';

const cx = classnames.bind(style);

const PlayDetailsTab = ({children, description, cast, metrics}) => {
  return (
    <div className={cx('main')}>
      <div className={cx('content')}>
        {children}
      </div>
      <div className={cx('description')}>
        {description}
      </div>
      {(metrics) && (
        <div className={cx('metrics')}>
          {metrics}
        </div>
      )}
      {(cast) && (
        <div className={cx('cast', 'dracor-scrollbar')}>
          {cast}
        </div>
      )}
    </div>
  );
};

PlayDetailsTab.propTypes = {
  cast: PropTypes.element,
  description: PropTypes.element,
  metrics: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

PlayDetailsTab.defaultProps = {
  cast: null
};

export default PlayDetailsTab;
