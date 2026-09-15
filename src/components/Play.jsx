import {useMemo, useState} from 'react';
import {apiUrl} from '../loaders';
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

const PlayInfo = ({play, metrics, tab: rawTab}) => {
  const [chartType, setChartType] = useState('sapogov');

  const graph = useMemo(
    () => makeGraph(play.characters, play.segments, nodeProps, edgeColor),
    [play]
  );

  // Resolve the active tab from the route param; fall back to network.
  let tab = rawTab || 'network';
  if (tab === 'relations' && !play.relations) tab = 'network';

  const groups = play.characters
    .filter((m) => Boolean(m.isGroup))
    .map((m) => m.id);

  const teiUrl = `${apiUrl}/corpora/${play.corpus}/plays/${play.name}/tei`;

  const castList = <CastList hasTitle characters={play.characters || []} />;

  const playMetrics = <PlayMetrics play={play} metrics={metrics} />;

  let tabContent;
  let description;
  let characters = null;
  let metricsPane = null;
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
    tabContent = <ToolsTab corpusId={play.corpus} playId={play.name} />;
    description = (
      <p>
        This tab provides links to third-party tools. The selected text layer
        will be loaded from the DraCor API for external analysis.
      </p>
    );
  } else {
    tabContent = <NetworkGraph {...{graph, nodeColor, edgeColor, play}} />;
    characters = castList;
    metricsPane = playMetrics;
    description = (
      <p>
        This tab shows a co-occurrence network. If characters appear in the same
        scene or act, they are linked.
      </p>
    );
  }

  const authors = play.authors.map((a) => a.name).join(' · ');

  // Hide the relations tab when the play has no relation data.
  const items = navItems.filter(
    (item) => item.name !== 'relations' || play.relations
  );

  return (
    <div className="h-100 d-md-flex flex-md-column dracor-page">
      <title>{`${authors}: ${play.title} - DraCor`}</title>
      <PlayDetailsHeader play={play}>
        <PlayDetailsNav
          items={items}
          current={tab}
          corpusId={play.corpus}
          playId={play.name}
        />
      </PlayDetailsHeader>
      <div className="container-fluid">
        <PlayDetailsTab
          characters={characters}
          description={description}
          metrics={metricsPane}
          segments={segments}
        >
          {tabContent}
        </PlayDetailsTab>
      </div>
    </div>
  );
};

export default PlayInfo;
