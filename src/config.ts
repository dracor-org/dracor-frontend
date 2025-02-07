import pkg from '../package.json';

export const version = import.meta.env.VITE_VERSION || pkg.version;
export const apiUrl = import.meta.env.VITE_DRACOR_API;
export const guidelinesUrl = import.meta.env.VITE_DRACOR_GUIDELINES;
export const sparqlUrl = import.meta.env.VITE_SPARQL_URL;
export const ezlinavisUrl = import.meta.env.VITE_EZLINAVIS_URL;
export const legacyApiUrl = import.meta.env.VITE_DRACOR_LEGACY_API;
export const legacyDocPath = '/doc/legacy/api';
export const showPrizeBadge = import.meta.env.VITE_WITH_RAHTZ_PRIZE === 'yes';
