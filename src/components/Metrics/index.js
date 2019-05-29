import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'reactstrap';
import config from '../../config';

const {apiUrl} = config;

// Numbers received from the API can be in scientific notation (e.g.
// 8.248968E6), which is why we need to use parseFloat.
const fn = val => Number(parseFloat(val)).toLocaleString('en');

class Metrics extends Component {
  constructor (props) {
    super(props);
    this.state = {data: null};
  }

  componentWillMount () {
    this.load();
  }

  load () {
    const url = `${apiUrl}/corpora?include=metrics`;
    fetch(url, {})
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({data});
      })
      .catch(error => {
        console.log('parsing failed', error);
      });
  }

  renderData () {
    const {data} = this.state;
    if (!data || data.length === 0) {
      return null;
    }

    return (
      <Row>
        {data.map(m => (
          <Col
            key={`metrics-${m.name}`}
            xl={4}
            lg={6}
            md={6}
            sm={12}
            xs={12}
          >
            <h3>
              <Link to={`/${m.name}`}>{m.title}</Link>
            </h3>
            <table className="table">
              <tbody>
                <tr>
                  <th>Number of plays</th>
                  <td>{fn(m.metrics.plays)}</td>
                </tr>
                <tr>
                  <th>
                    <code>person</code> + <code>personGrp</code>
                  </th>
                  <td>
                    {fn(m.metrics.characters)}
                    {
                      m.metrics.male + m.metrics.female > 0
                        ? ` (male: ${m.metrics.male}, female: ${m.metrics.female})`
                        : ''
                    }
                  </td>
                </tr>
                <tr>
                  <th>
                    <code>text</code>
                  </th>
                  <td>{fn(m.metrics.wordcount.text)} tokens</td>
                </tr>
                <tr>
                  <th>
                    <code>sp</code>
                  </th>
                  <td>
                    {fn(m.metrics.sp)} ({fn(m.metrics.wordcount.sp)} tokens)
                  </td>
                </tr>
                <tr>
                  <th>
                    <code>stage</code>
                  </th>
                  <td>
                    {fn(m.metrics.stage)} ({fn(m.metrics.wordcount.stage)} tokens)
                  </td>
                </tr>
                <tr>
                  <th>
                    Last update
                  </th>
                  <td>{(new Date(m.metrics.updated)).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        ))}
      </Row>
    );
  }

  render () {
    const {data} = this.state;
    return data ? this.renderData() : <em>loading...</em>;
  }
}

export default Metrics;
