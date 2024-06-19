import pkg from '../package.json';

export const version = process.env.REACT_APP_VERSION || pkg.version;
export const apiUrl = process.env.REACT_APP_DRACOR_API;
export const sparqlUrl = process.env.REACT_APP_SPARQL_URL;
export const ezlinavisUrl = process.env.REACT_APP_EZLINAVIS_URL;
export const legacyApiUrl = process.env.REACT_APP_DRACOR_LEGACY_API;
export const legacyDocPath = '/doc/legacy/api';
export const showPrizeBadge = process.env.REACT_APP_WITH_RAHTZ_PRIZE === 'yes';
