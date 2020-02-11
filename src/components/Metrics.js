import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Slider from 'react-slick';
import api from '../api';

// Numbers received from the API can be in scientific notation (e.g.
// 8.248968E6), which is why we need to use parseFloat.
const fn = val => Number(parseFloat(val)).toLocaleString('en');

function byNumOfPlays (a, b) {
  if (a.metrics.plays > b.metrics.plays) {
    return 1;
  }

  if (a.metrics.plays < b.metrics.plays) {
    return -1;
  }

  return 0;
}

const settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  arrows: true,
  autoplay: false,
  dots: true,
  centerPadding: '60px',
  slidesToShow: 6,
  speed: 1000,
  responsive: [{
    breakpoint: 2100,
    settings: {
      slidesToShow: 5,
      infinite: true
    }
  }, {
    breakpoint: 1800,
    settings: {
      slidesToShow: 4,
      infinite: true
    }
  }, {
    breakpoint: 1450,
    settings: {
      slidesToShow: 3,
      infinite: true
    }
  }, {
    breakpoint: 1150,
    settings: {
      slidesToShow: 2,
      infinite: true
    }
  }, {
    breakpoint: 800,
    settings: {
      slidesToShow: 1,
      dots: true
    }
  }]
};

const Metrics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData () {
      try {
        const response = await api.get('/corpora?include=metrics');
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  if (!data) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <Slider {...settings}>
      {data.sort(byNumOfPlays).reverse().map(m => (
        <div
          key={`metrics-${m.name}`}
          className="corpus-card"
          xl={4}
          lg={6}
          md={6}
          sm={12}
          xs={12}
        >
          <h1><span>{m.name}</span>DraCor</h1>
          <h3>
            <Link to={`/${m.name}`}>{m.title}</Link>
          </h3>
          <table>
            <tbody>
              <tr>
                <th className="number-plays">{fn(m.metrics.plays)}</th>
                <td>Number of plays</td>
              </tr>
              <tr>
                <th>
                  {fn(m.metrics.characters)}
                  <br/>
                  <span>
                    {
                      m.metrics.male + m.metrics.female > 0
                        ? ` (M: ${m.metrics.male}, F: ${m.metrics.female})`
                        : ''
                    }
                  </span>
                </th>
                <td>
                  <code>person</code> + <code>personGrp</code>
                  <br/>Number of characters
                </td>
              </tr>
              <tr>
                <th>
                  {fn(m.metrics.wordcount.text)}
                </th>
                <td>
                  <code>text</code>
                  <br/>Text tokens
                </td>
              </tr>
              <tr>
                <th>
                  {fn(m.metrics.sp)} <br/><span>({fn(m.metrics.wordcount.sp)})</span>
                </th>
                <td>
                  <code>sp</code>
                  <br/>(Tokens)
                </td>
              </tr>
              <tr>
                <th>
                  {fn(m.metrics.stage)} <br/><span>({fn(m.metrics.wordcount.stage)})</span>
                </th>
                <td>
                  <code>stage</code>
                  <br/>(Tokens)
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
        </div>
      ))}
    </Slider>
  );
};

export default Metrics;
