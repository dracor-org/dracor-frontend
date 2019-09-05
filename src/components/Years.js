import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function formatEra (year) {
  if (year === null) {
    return '';
  }

  return year < 0 ? `${year * -1} BCE` : String(year);
}

const Years = ({written, premiere, print}) => {
  return (
    <>
      {written && (
        <>
          <span title="written">
            <FontAwesomeIcon icon="pen-fancy" size="sm"/>&nbsp;
            {formatEra(written)}
          </span>
          {' '}
        </>
      )}
      {premiere && (
        <>
          <span title="premiered">
            <FontAwesomeIcon icon="theater-masks" size="sm"/>&nbsp;
            {formatEra(premiere)}
          </span>
          {' '}
        </>
      )}
      {print && (
        <span title="printed">
          <FontAwesomeIcon icon="book" size="sm"/>&nbsp;
          {formatEra(print)}
        </span>
      )}
    </>
  );
};

Years.propTypes = {
  written: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  premiere: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  print: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

Years.defaultProps = {
  written: null,
  premiere: null,
  print: null
};

export default Years;
