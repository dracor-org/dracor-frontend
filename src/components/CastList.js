import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tooltip} from 'reactstrap';
import Octicon from 'react-octicon';

class TooltipItem extends Component {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  toggle () {
    this.setState(prevState => ({tooltipOpen: !prevState.tooltipOpen}));
  }

  render () {
    const {tooltipOpen} = this.state;
    const {id, placement, children} = this.props;
    const tid = `tooltip-${id}`;
    return (
      <span id={tid}>
        {children}
        <Tooltip
          delay={{show: 0, hide: 25}}
          isOpen={tooltipOpen}
          placement={placement}
          target={tid}
          toggle={this.toggle}
        >
          {id}
        </Tooltip>
      </span>
    );
  }
}

const CastList = ({cast}) => (
  <ol>
    {cast.map(member => (
      <li key={member.id}>
        <TooltipItem id={member.id} placement="top">
          {member.name ? <span>{member.name}</span> : <em>{member.id}</em>}
          {'  '}
          {
            member.isGroup
            ? <Octicon style={{color: 'gray'}} name="organization"/>
            : null
          }
        </TooltipItem>
      </li>
    ))}
  </ol>
);

CastList.propTypes = {
  cast: PropTypes.array.isRequired
};

export default CastList;
