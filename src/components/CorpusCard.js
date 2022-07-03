import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Numbers received from the API can be in scientific notation (e.g.
// 8.248968E6), which is why we need to use parseFloat.
const fn = (val) => Number(Number.parseFloat(val)).toLocaleString('en');

const CorpusCard = ({name, title, acronym, metrics}) => {
  const prefix = acronym
    ? acronym.replace('DraCor', '')
    : name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <div className="corpus-card" xl={4} lg={6} md={6} sm={12} xs={12}>
      <Link to={`/${name}`}>
        <h2>
          <span>{prefix}</span>DraCor
        </h2>
      </Link>
      <h3>
        <Link to={`/${name}`}>{title}</Link>
      </h3>
      <table>
        <tbody>
          <tr>
            <th className="number-plays">{fn(metrics.plays)}</th>
            <td>Number of plays</td>
          </tr>
          <tr>
            <th>
              {fn(metrics.characters)}
              <br />
              <span>
                {metrics.male + metrics.female > 0
                  ? ` (M: ${metrics.male}, F: ${metrics.female})`
                  : ''}
              </span>
            </th>
            <td>
              <code>person</code> + <code>personGrp</code>
              <br />
              Number of characters
            </td>
          </tr>
          <tr>
            <th>{fn(metrics.wordcount.text)}</th>
            <td>
              <code>text</code>
              <br />
              Text tokens
            </td>
          </tr>
          <tr>
            <th>
              {fn(metrics.sp)} <br />
              <span>({fn(metrics.wordcount.sp)})</span>
            </th>
            <td>
              <code>sp</code>
              <br />
              (Tokens)
            </td>
          </tr>
          <tr>
            <th>
              {fn(metrics.stage)} <br />
              <span>({fn(metrics.wordcount.stage)})</span>
            </th>
            <td>
              <code>stage</code>
              <br />
              (Tokens)
            </td>
          </tr>
          <tr>
            <th>Last update</th>
            <td>{new Date(metrics.updated).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

CorpusCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  acronym: PropTypes.string,
  metrics: PropTypes.object.isRequired,
};

export default CorpusCard;
