import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import api from '../api';
import CorpusCard from './CorpusCard';

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
  centerMode: false,
  infinite: true,
  arrows: true,
  autoplay: false,
  dots: true,
  centerPadding: '60px',
  slidesToShow: 6,
  speed: 350,
  responsive: [{
    breakpoint: 2100,
    settings: {
      slidesToShow: 5
    }
  }, {
    breakpoint: 1920,
    settings: {
      slidesToShow: 4
    }
  }, {
    breakpoint: 1480,
    settings: {
      slidesToShow: 3
    }
  }, {
    breakpoint: 1020,
    settings: {
      slidesToShow: 2,
      arrows: false,
      autoplay: true
    }
  }, {
    breakpoint: 666,
    settings: {
      slidesToShow: 1,
      centerPadding: '25px',
      arrows: false,
      autoplay: true
    }
  }]
};

const Corpora = () => {
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
      {data.sort(byNumOfPlays).reverse().map(corpus => (
        <CorpusCard
          key={`card-${corpus.name}`}
          name={corpus.name}
          title={corpus.title}
          metrics={corpus.metrics}
        />
      ))}
    </Slider>
  );
};

export default Corpora;
