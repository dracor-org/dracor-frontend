import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const groupIcon = <FontAwesomeIcon icon="users" size="sm" style={{color: 'gray'}}/>;

const CastList = ({cast}) => (
  <ol>
    {cast.map(member => (
      <li key={member.id} title={member.id}>
        {member.name ? <span>{member.name}</span> : <em>{member.id}</em>}
        {'  '}
        {member.isGroup && groupIcon}
      </li>
    ))}
  </ol>
);

CastList.propTypes = {
  cast: PropTypes.array.isRequired
};

export default CastList;
