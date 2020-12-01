import React from 'react';
import {Col, Row} from 'reactstrap';

const Header = ({children}) => {
  console.log(typeof children);
  return (
    <Row tag="header" className="dracor-header">
      {typeof children === 'string' ? (
        <Col tag="h1">{children}</Col>
      ) : children}
    </Row>
  );
};

export default Header;
