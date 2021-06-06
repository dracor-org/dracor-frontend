import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './PlayDetailsTab.module.scss';

const cx = classnames.bind(style);

const PlayDetailsTab = ({sidebar, children}) => {
  return (
    <div className={cx('main')}>
      <div>
        <div>
          <div className={cx('content')}>
            {children}
          </div>
          {sidebar && (
            <div className={cx('sidebar')}>
              {sidebar}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PlayDetailsTab.propTypes = {
  sidebar: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

PlayDetailsTab.defaultProps = {
  sidebar: null
};

export default PlayDetailsTab;
