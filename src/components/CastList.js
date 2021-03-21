import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const CastList = ({cast}) => (
  <ol>
    {cast.map(member => (
      <li key={member.id} title={member.id}>
        {member.name ? <span>{member.name}</span> : <em>{member.id}</em>}
        {'  '}
        {member.sex === 'MALE' && <FontAwesomeIcon icon="mars" title="male"/>}
        {member.sex === 'FEMALE' && <FontAwesomeIcon icon="venus" title="female"/>}
        {' '}
        {member.isGroup && <FontAwesomeIcon icon="users" size="sm"/>}
      </li>
    ))}
  </ol>
);

CastList.propTypes = {
  cast: PropTypes.array.isRequired
};

export default CastList;
