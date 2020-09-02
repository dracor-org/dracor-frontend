import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export function formatEra (year, ceBefore = 0) {
  if (year === null) {
    return '';
  }

  const y = parseInt(year, 10);

  if (y < 0) {
    return `${y * -1} BCE`;
  }

  if (y < ceBefore) {
    return `${y} CE`;
  }

  return String(y);
}

export function formatYear (yearString) {
  // range, both BCE
  if (yearString.match('^-[0-9]{4}/-[0-9]{4}$')) {
    const years = yearString.split('/').map(y => parseInt(y, 10) * -1);
    return `${years[0]}-${years[1]} BCE`;
  }

  // range, mixed era
  if (yearString.match('^-?[0-9]{4}/-?[0-9]{4}$')) {
    const years = yearString.split('/');
    return `${formatEra(years[0])}-${formatEra(years[1], 1000)}`;
  }

  // not before
  if (yearString.match('^>-?[0-9]{4}')) {
    const year = yearString.substring(1);
    return `after ${formatEra(year, 1000)}`;
  }

  // not after
  if (yearString.match('^<-?[0-9]{4}')) {
    const year = yearString.substring(1);
    return `before ${formatEra(year, 1000)}`;
  }

  // single year
  if (yearString.match('^-?[0-9]{4}')) {
    return formatEra(yearString, 1000);
  }

  return yearString;
}

const Years = ({written, premiere, print}) => {
  return (
    <>
      {written && (
        <>
          <span title="written">
            <FontAwesomeIcon icon="pen-fancy" size="sm"/>&nbsp;
            {formatYear(written)}
          </span>
          {' '}
        </>
      )}
      {premiere && (
        <>
          <span title="premiered">
            <FontAwesomeIcon icon="theater-masks" size="sm"/>&nbsp;
            {formatYear(premiere)}
          </span>
          {' '}
        </>
      )}
      {print && (
        <span title="printed">
          <FontAwesomeIcon icon="book" size="sm"/>&nbsp;
          {formatYear(print)}
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
