import {Container} from 'reactstrap';
import CorpusIndex from './CorpusIndex';
import Header from './Header';
import Footer from './Footer';
import CorpusLabel from './CorpusLabel';
import classnames from 'classnames/bind';
import style from './Corpus.module.scss';

const cx = classnames.bind(style);

const Corpus = ({corpus}) => {
  return (
    <Container fluid>
      <div>
        <div className={cx('label-wrapper')}>
          <CorpusLabel
            name={corpus.name}
            title={corpus.title}
            acronym={corpus.acronym}
          />
        </div>
        <Header>{corpus.title}</Header>
        <CorpusIndex data={corpus} />
        <Footer />
      </div>
    </Container>
  );
};

export default Corpus;
