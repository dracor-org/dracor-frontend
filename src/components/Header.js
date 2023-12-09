import React from 'react';
import {Col, Row} from 'reactstrap';
import classnames from 'classnames/bind';
import style from './Header.module.scss';

const cx = classnames.bind(style);

/**
 * The main header for a DraCor page
 *
 * The header provides a wrapping bootstrap row. Its children should be either
 * a string or one or more bootstrap columns containing a h1 element.
 */

const Header = ({children, className = ''}) => {
  return (
    <Row tag="header" className={cx(['main', className])}>
      {typeof children === 'string' ? <Col tag="h1">{children}</Col> : children}
    </Row>
  );
};

export default Header;
