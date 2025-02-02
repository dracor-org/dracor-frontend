import {useEffect, useState} from 'react';
import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import api from '../api';
import {makeGraph} from '../network';
import PlayDetailsHeader from './PlayDetailsHeader';
import PlayDetailsNav from './PlayDetailsNav';
import PlayDetailsTab from './PlayDetailsTab';
import CastList from './CastList';
import SourceInfo from './SourceInfo';
import DownloadLinks from './DownloadLinks';
import NetworkGraph from './NetworkGraph';
import RelationsGraph from './RelationsGraph';
import SpeechDistribution, {SpeechDistributionNav} from './SpeechDistribution';
import TEIPanel from './TEIPanel';
import ToolsTab from './ToolsTab';
import PlayMetrics from './PlayMetrics';
import Segments from './Segments';

import './Play.scss';

const apiUrl = api.getBaseURL();

const edgeColor = '#61affe65';
const nodeColor = '#61affe';

const nodeProps = (node) => {
  const {sex} = node;
  const color = sex === 'MALE' || sex === 'FEMALE' ? '#1f2448' : '#61affe';
  const type = sex === 'MALE' ? 'square' : 'circle';
  return {color, type};
};

const navItems = [
  {name: 'network', label: 'Network'},
  {name: 'relations', label: 'Relations'},
  {name: 'speech', label: 'Speech distribution'},
  {name: 'text', label: 'Full text'},
  {name: 'downloads', label: 'Downloads'},
  {name: 'tools', label: 'Tools'},
];

const tabNames = new Set(navItems.map((item) => item.name));

const PlayInfo = ({corpusId, playId}) => {
  const [play, setPlay] = useState(null);
  const [graph, setGraph] = useState(null);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('sapogov');

  useEffect(() => {
    async function fetchPlay() {
      setError(null);
      const url = `/corpora/${corpusId}/plays/${playId}`;
      // eslint-disable-next-line no-console
      console.log('loading play %s ...', url);
      try {
        const response = await api.get(url);
        if (response.ok && response.data) {
          const play = response.data;
          const {characters, segments} = play;
          const graph = makeGraph(characters, segments, nodeProps, edgeColor);
          setPlay(play);
          setGraph(graph);
        } else if (response.status === 404) {
          setError(new Error('not found'));
        } else {
          setError(response.originalError);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    fetchPlay();
  }, [corpusId, playId]);

  if (error && error.message === 'not found') {
    return <p>No such play!</p>;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return <p>Error!</p>;
  }

  if (!play) {
    return <p className="loading">Loading...</p>;
  }

  if (!graph) {
    return <p>No Graph!</p>;
  }

  const groups = play.characters
    .filter((m) => Boolean(m.isGroup))
    .map((m) => m.id);

  let tab = document.location.hash.replace('#', '');
  if (!tabNames.has(tab) || (tab === 'relations' && !play.relations)) {
    tab = 'network';
  }

  const teiUrl = `${apiUrl}/corpora/${play.corpus}/plays/${play.name}/tei`;

  const castList = <CastList hasTitle characters={play.characters || []} />;

  const playMetrics = <PlayMetrics play={play} />;

  let tabContent = null;
  let description = null;
  let characters = null;
  let metrics = null;
  let segments = null;

  if (tab === 'speech') {
    tabContent = (
      <SpeechDistribution
        type={chartType}
        segments={play.segments}
        {...{groups}}
      />
    );
    description = (
      <SpeechDistributionNav
        type={chartType}
        onChange={(type) => setChartType(type)}
      />
    );
  } else if (tab === 'downloads') {
    tabContent = <DownloadLinks play={play} />;
    description = (
      <p>
        This tab provides download options for different semantic layers of a
        single play in different formats for a closer analysis with appropriate
        tools.
      </p>
    );
  } else if (tab === 'text') {
    tabContent = <TEIPanel url={teiUrl} />;
    description = (
      <SourceInfo source={play.source} original={play.originalSource} />
    );
    segments = <Segments play={play} />;
  } else if (tab === 'relations') {
    tabContent = <RelationsGraph {...{play, nodeColor, edgeColor}} />;
    characters = castList;
    description = (
      <p>
        This tab visualises kinship and other relationship data, following the
        encoding scheme proposed in{' '}
        <a href="https://doi.org/10.5281/zenodo.4621778">
          Wiedmer, Pagel, Reiter 2020
        </a>
        .
      </p>
    );
  } else if (tab === 'tools') {
    tabContent = <ToolsTab corpusId={corpusId} playId={playId} />;
    description = (
      <p>
        This tab provides links to third-party tools. The selected text layer
        will be loaded from the DraCor API for external analysis.
      </p>
    );
  } else {
    tabContent = <NetworkGraph {...{graph, nodeColor, edgeColor, play}} />;
    characters = castList;
    metrics = playMetrics;
    description = (
      <p>
        This tab shows a co-occurrence network. If characters appear in the same
        scene or act, they are linked.
      </p>
    );
  }

  const authors = play.authors.map((a) => a.name).join(' · ');

  // we remove relations from nav items if none are available for the play
  const items = navItems.filter(
    (item) => item.name !== 'relations' || play.relations
  );

  return (
    <div className="h-100 d-md-flex flex-md-column dracor-page">
      <Helmet titleTemplate="%s - DraCor">
        <title>{`${authors}: ${play.title}`}</title>
      </Helmet>
      <PlayDetailsHeader play={play}>
        <PlayDetailsNav items={items} current={tab} />
      </PlayDetailsHeader>
      <Container fluid>
        <PlayDetailsTab
          characters={characters}
          description={description}
          metrics={metrics}
          segments={segments}
        >
          {tabContent}
        </PlayDetailsTab>
      </Container>
    </div>
  );
};

export default PlayInfo;
