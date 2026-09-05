import CorpusIndex from './CorpusIndex';
import Header from './Header';
import Footer from './Footer';
import CorpusLabel from './CorpusLabel';
import type {CorpusDetail} from '../loaders';

interface Props {
  corpus: CorpusDetail;
}

export default function Corpus({corpus}: Props) {
  return (
    <div className="container-fluid">
      <div>
        <div className="-mx-4 pt-1 pl-4 bg-primary">
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
    </div>
  );
}
