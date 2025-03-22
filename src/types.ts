export interface ApiInfo {
  name: string;
  version: string;
  status: string;
  existdb: string;
}

export interface DracorContext {
  corpora: never[];
  apiInfo?: ApiInfo;
}

export interface Ref {
  ref: string;
  type: string;
}

export interface Author {
  name: string;
  fullname?: string;
  shortname?: string;
  refs?: Ref[];
  // DEPRECATED
  key?: string;
}

export interface Character {
  id: string;
  name: string;
  sex?: 'FEMALE' | 'MALE' | 'UNKNOWN';
  isGroup?: boolean;
  wikidataId?: string;
}

export interface Relation {
  source: string;
  target: string;
  type: string;
  directed: boolean;
}

export interface Segment {
  number: number;
  title?: string;
  type?: string; // 'scene'
  speakers: string[];
}

export interface Play {
  id: string;
  name: string;
  corpus: string;
  title: string;
  subtitle?: string;
  authors: Author[];
  genre: string;
  libretto: boolean;
  originalSource: string;
  relations?: Relation[];
  characters: Character[];
  segments: Segment[];
  source?: {
    name: string;
    url: string;
  };
  wikidataId?: string;
  yearNormalized: number;
  yearPremiered: string;
  yearPrinted: string;
  yearWritten: string;
  allInIndex?: number;
  allInSegment?: number;
}

export interface PlayMetricsNode {
  id: string;
  betweenness: number;
  closeness: number;
  degree: number;
  eigenvector: number | null;
  weightedDegree: number;
}

export interface PlayMetrics {
  id: string;
  name: string;
  corpus: string;
  nodes: PlayMetricsNode[];
  averageClustering: number;
  averageDegree: number;
  averagePathLength: number;
  density: number;
  diameter: number;
  maxDegree: number;
  maxDegreeIds: string[];
  numConnectedComponents: number;
  numEdges: number;
  size: number;
  wikipediaLinkCount: number | null;
}
