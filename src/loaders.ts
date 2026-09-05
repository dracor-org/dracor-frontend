import {apiUrl as configuredApiUrl} from './config';
import type {ApiInfo, Play, PlayMetrics, Sitemap} from './types';

// In dev without VITE_DRACOR_API the app relies on the Vite proxy at /api/v1.
export const apiUrl = configuredApiUrl || '/api/v1';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {Accept: 'application/json'},
  });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${response.status} ${response.statusText}`
    );
  }
  return (await response.json()) as T;
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export function fetchApiInfo(): Promise<ApiInfo> {
  return apiGet<ApiInfo>('/info');
}

export interface CorpusListEntry {
  name: string;
  title: string;
  acronym?: string;
  repository?: string;
  commit?: string;
  metrics?: {
    plays: number;
    characters: number;
    male: number;
    female: number;
    text: number;
    sp: number;
    stage: number;
    wordcount: {
      text: number;
      sp: number;
      stage: number;
    };
    updated: string;
  };
}

export function fetchCorpora(
  includeMetrics = false
): Promise<CorpusListEntry[]> {
  return apiGet<CorpusListEntry[]>(
    includeMetrics ? '/corpora?include=metrics' : '/corpora'
  );
}

export interface CorpusDetail {
  name: string;
  title: string;
  acronym?: string;
  description?: string;
  repository?: string;
  commit?: string;
  licence?: string;
  licenceUrl?: string;
  plays: PlayListEntry[];
}

export interface PlayListEntry {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  authors?: {name: string}[];
  editors?: {name: string; role?: string}[];
  yearNormalized?: number | null;
  yearWritten?: string | null;
  yearPremiered?: string | null;
  yearPrinted?: string | null;
  networkSize?: number | string;
  wikidataId?: string;
  // Derived on the client — kept because existing CorpusIndex reads them.
  authorNames?: string;
  translators?: {name: string; role?: string}[];
  translatorNames?: string;
}

export async function fetchCorpus(corpusId: string): Promise<CorpusDetail> {
  const corpus = await apiGet<CorpusDetail>(`/corpora/${corpusId}`);
  corpus.plays.forEach((p) => {
    p.networkSize = Number.parseInt(String(p.networkSize ?? 0), 10) || 0;
    if (p.authors) {
      p.authorNames = p.authors.map((a) => a.name).join(' · ');
    } else {
      p.authors = [];
      p.authorNames = 'Anonymous';
    }
    p.translators = (p.editors || []).filter((e) => e.role === 'translator');
    p.translatorNames = p.translators.map((t) => t.name).join(' · ');
  });
  return corpus;
}

export function fetchPlay(corpusId: string, playId: string): Promise<Play> {
  return apiGet<Play>(`/corpora/${corpusId}/plays/${playId}`);
}

export function fetchPlayMetrics(
  corpusId: string,
  playId: string
): Promise<PlayMetrics> {
  return apiGet<PlayMetrics>(`/corpora/${corpusId}/plays/${playId}/metrics`);
}

export interface WikidataAuthorInfo {
  name?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  imageUrl?: string;
}

export async function fetchWikidataAuthor(
  id: string
): Promise<WikidataAuthorInfo | null> {
  try {
    return await apiGet<WikidataAuthorInfo>(`/wikidata/author/${id}`);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function fetchSitemap(url: string): Promise<Sitemap> {
  const response = await fetch(url, {
    headers: {Accept: 'application/json'},
  });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Sitemap fetch failed: ${response.status}`
    );
  }
  return (await response.json()) as Sitemap;
}
