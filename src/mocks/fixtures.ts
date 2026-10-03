import type {ApiInfo, Play, PlayMetrics} from '../types';
import type {CorpusDetail, CorpusListEntry} from '../loaders';

export const apiInfo: ApiInfo = {
  name: 'DraCor API',
  version: '1.0.0',
  status: 'ok',
  existdb: 'test',
};

type CorpusMetrics = NonNullable<CorpusListEntry['metrics']>;

/** Full metrics object — `DracorCorpusCard` reads `wordcount.text`, so a
 * partial stub makes the card throw rather than fail an assertion. */
export function makeMetrics(
  overrides: Partial<CorpusMetrics> = {}
): CorpusMetrics {
  return {
    plays: 1,
    characters: 3,
    male: 2,
    female: 1,
    text: 1,
    sp: 1,
    stage: 1,
    wordcount: {text: 100, sp: 80, stage: 20},
    updated: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export const corpora: CorpusListEntry[] = [
  {
    name: 'test',
    title: 'Test Drama Corpus',
    acronym: 'TestDraCor',
    repository: 'https://github.com/dracor-org/testdracor',
    commit: '0123456789abcdef0123456789abcdef01234567',
    metrics: {
      plays: 2,
      characters: 12,
      male: 7,
      female: 5,
      text: 3,
      sp: 4,
      stage: 5,
      wordcount: {text: 1000, sp: 800, stage: 200},
      updated: '2026-01-01T00:00:00Z',
    },
  },
  {
    name: 'small',
    title: 'Small Drama Corpus',
    acronym: 'SmallDraCor',
    repository: 'https://github.com/dracor-org/smalldracor',
    commit: 'fedcba9876543210fedcba9876543210fedcba98',
    metrics: {
      plays: 1,
      characters: 3,
      male: 2,
      female: 1,
      text: 1,
      sp: 1,
      stage: 1,
      wordcount: {text: 100, sp: 80, stage: 20},
      updated: '2026-01-01T00:00:00Z',
    },
  },
];

export const corpus: CorpusDetail = {
  name: 'test',
  title: 'Test Drama Corpus',
  acronym: 'TestDraCor',
  description: 'A corpus assembled for the test suite.',
  repository: 'https://github.com/dracor-org/testdracor',
  commit: '0123456789abcdef0123456789abcdef01234567',
  licence: 'CC0',
  licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  plays: [
    {
      id: 'test000001',
      name: 'mustermann-mustertragoedie',
      title: 'Mustertragödie',
      subtitle: 'Ein Trauerspiel in fünf Aufzügen',
      authors: [{name: 'Mustermann, Maria'}],
      editors: [{name: 'Beispiel, Bernd', role: 'translator'}],
      yearNormalized: 1799,
      yearWritten: '1798',
      yearPremiered: '1799',
      yearPrinted: '1800',
      networkSize: '4',
      wikidataId: 'Q1',
    },
    {
      id: 'test000002',
      name: 'anonymous-lustspiel',
      title: 'Lustspiel',
      yearNormalized: 1850,
      networkSize: '2',
    },
  ],
};

export const play: Play = {
  id: 'test000001',
  name: 'mustermann-mustertragoedie',
  corpus: 'test',
  title: 'Mustertragödie',
  subtitle: 'Ein Trauerspiel in fünf Aufzügen',
  authors: [{name: 'Mustermann, Maria', fullname: 'Maria Mustermann'}],
  editors: [{name: 'Beispiel, Bernd', fullname: 'Bernd Beispiel'}],
  genre: 'Tragedy',
  libretto: false,
  originalSource: 'Musterverlag, Musterstadt 1800',
  source: {name: 'TextGrid', url: 'https://textgrid.invalid/test000001'},
  wikidataId: 'Q42',
  yearNormalized: 1799,
  yearWritten: '1798',
  yearPremiered: '1799',
  yearPrinted: '1800',
  characters: [
    {id: 'koenig', name: 'König', sex: 'MALE'},
    {id: 'koenigin', name: 'Königin', sex: 'FEMALE'},
    {id: 'bote', name: 'Bote', sex: 'MALE'},
    {id: 'volk', name: 'Volk', sex: 'UNKNOWN', isGroup: true},
  ],
  segments: [
    {
      number: 1,
      title: 'Act 1, Scene 1',
      type: 'scene',
      speakers: ['koenig', 'koenigin'],
    },
    {
      number: 2,
      title: 'Act 1, Scene 2',
      type: 'scene',
      speakers: ['koenig', 'bote'],
    },
    {
      number: 3,
      title: 'Act 2, Scene 1',
      type: 'scene',
      speakers: ['koenigin', 'volk'],
    },
  ],
  relations: [
    {source: 'koenig', target: 'koenigin', type: 'siblings', directed: false},
    {source: 'bote', target: 'koenig', type: 'associatedWith', directed: true},
  ],
};

export const playMetrics: PlayMetrics = {
  id: 'test000001',
  name: 'mustermann-mustertragoedie',
  corpus: 'test',
  nodes: [
    {
      id: 'koenig',
      betweenness: 1,
      closeness: 1,
      degree: 2,
      eigenvector: 0.7,
      weightedDegree: 2,
    },
    {
      id: 'koenigin',
      betweenness: 0,
      closeness: 0.6,
      degree: 2,
      eigenvector: 0.5,
      weightedDegree: 2,
    },
    {
      id: 'bote',
      betweenness: 0,
      closeness: 0.5,
      degree: 1,
      eigenvector: 0.3,
      weightedDegree: 1,
    },
    {
      id: 'volk',
      betweenness: 0,
      closeness: 0.5,
      degree: 1,
      eigenvector: 0.2,
      weightedDegree: 1,
    },
  ],
  averageClustering: 0,
  averageDegree: 1.5,
  averagePathLength: 1.5,
  density: 0.5,
  diameter: 2,
  maxDegree: 2,
  maxDegreeIds: ['koenig', 'koenigin'],
  numConnectedComponents: 1,
  numEdges: 3,
  size: 4,
  wikipediaLinkCount: 1,
};

export const playTei = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader><fileDesc><titleStmt><title>Mustertragödie</title></titleStmt></fileDesc></teiHeader>
  <text><body><div type="act"><head>Erster Aufzug</head>
    <sp who="#koenig"><speaker>König</speaker><p>Ein Musterwort.</p></sp>
  </div></body></text>
</TEI>`;

export const docMarkdown = `# About DraCor

A paragraph rendered by the doc page test.
`;
