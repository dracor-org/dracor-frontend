import Slider from 'react-slick';
import CorpusCard from './CorpusCard';
import '../slick.css';
import '../slick-theme.css';
import '../slick-theme.scss';

function byNumOfPlays(a, b) {
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
  swipeToSlide: true,
  draggable: true,
  customPadding: '60px',
  slidesToShow: 7,
  speed: 350,
  responsive: [
    {
      breakpoint: 2360,
      settings: {
        slidesToShow: 6,
      },
    },
    {
      breakpoint: 2050,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1700,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        arrows: false,
        autoplay: true,
      },
    },
    {
      breakpoint: 767,
      settings: {
        unslick: true,
      },
    },
  ],
};

const Corpora = ({data}) => {
  if (!data) {
    return <p className="loading">Loading...</p>;
  }

  if (data.length === 0) {
    return <p className="loading">No corpora found</p>;
  }

  return (
    <Slider {...settings}>
      {data
        .sort(byNumOfPlays)
        .reverse()
        .map((corpus) => (
          <CorpusCard
            key={`card-${corpus.name}`}
            name={corpus.name}
            title={corpus.title}
            metrics={corpus.metrics}
            acronym={corpus.acronym}
            commit={corpus.commit}
            repo={corpus.repository}
          />
        ))}
    </Slider>
  );
};

export default Corpora;
