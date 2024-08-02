import pkg from '../package.json';

export const version = import.meta.env.REACT_APP_VERSION || pkg.version;
export const apiUrl = import.meta.env.REACT_APP_DRACOR_API;
export const sparqlUrl = import.meta.env.REACT_APP_SPARQL_URL;
export const ezlinavisUrl = import.meta.env.REACT_APP_EZLINAVIS_URL;
export const legacyApiUrl = import.meta.env.REACT_APP_DRACOR_LEGACY_API;
export const legacyDocPath = '/doc/legacy/api';
export const showPrizeBadge = import.meta.env.REACT_APP_WITH_RAHTZ_PRIZE === 'yes';
