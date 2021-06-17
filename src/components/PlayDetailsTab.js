import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './PlayDetailsTab.module.scss';

const cx = classnames.bind(style);

const PlayDetailsTab = ({children, description, sidebar, metrics}) => {
  return (
    <div className={cx('main')}>
      <div>
        <div>
          <div className={cx('content')}>
            {children}
          </div>
          {(sidebar || description) && (
            <div className={cx('sidebar', 'dracor-scrollbar')}>
              {description && (
                <div className={cx('description')}>
                  {description}
                </div>
              )}
              {metrics}
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
  description: PropTypes.element,
  metrics: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

PlayDetailsTab.defaultProps = {
  sidebar: null
};

export default PlayDetailsTab;
