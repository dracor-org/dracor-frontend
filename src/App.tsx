import {useState, useEffect, lazy, Suspense} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import api from './api';
import {ApiInfo, Sitemap} from './types';
import {DracorContext} from './context';
import {legacyApiUrl, legacyDocPath, sitemapUrl} from './config';
import defaultSitemap from './sitemap';
import Home from './components/Home';
import DocPage from './components/DocPage';
import TopNav from './components/TopNav';
import Corpus from './components/Corpus';
import Play from './components/PlayPage';
import OddPage from './components/OddPage';
import APIDoc from './components/APIDoc';
import CorpusRegistry from './components/CorpusRegistry';
import './icons';

const SparqlUi = lazy(() => {
  if (import.meta.env.VITE_WITH_SPARQL === 'yes') {
    return import('./components/SparqlUi');
  }
  return import('./components/SparqlPlaceholder');
});

const App = () => {
  const [sitemap, setSitemap] = useState<Sitemap>([]);
  const [apiInfo, setApiInfo] = useState<ApiInfo>();
  const [corpora, setCorpora] = useState([]);

  useEffect(() => {
    async function fetchSitemap(url: string) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
        if (response.status !== 200) {
          // eslint-disable-next-line no-console
          console.log(response.status);
          return;
        }
        const data = await response.json();
        setSitemap(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    if (sitemapUrl) {
      fetchSitemap(sitemapUrl);
    } else {
      setSitemap(defaultSitemap);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('fetching API info...');

    async function fetchInfo() {
      try {
        const response = await api.get('/info');
        if (response.ok) {
          setApiInfo(response.data as ApiInfo);
        } else {
          throw new Error(
            `Failed to load API info. Status: ${response.status}`
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    fetchInfo();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('fetching corpora...');

    async function fetchCorpora() {
      try {
        const response = await api.get('/corpora');
        if (response.ok) {
          setCorpora(response.data as []);
        } else {
          throw new Error(`Failed to load corpora. Status: ${response.status}`);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    fetchCorpora();
  }, []);

  return (
    <BrowserRouter>
      <DracorContext.Provider value={{corpora, apiInfo}}>
        <div className="d-flex flex-column" style={{height: '100%'}}>
          <TopNav sitemap={sitemap} />
          <Suspense fallback={<div>Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:corpusId">
                <Route index element={<Corpus />} />
                <Route path=":playId" element={<Play />} />
              </Route>
              <Route path="/doc/:slug" element={<DocPage />} />
              <Route path="/doc/api" element={<APIDoc />} />
              <Route path="/doc/odd" element={<OddPage />} />
              <Route path="/doc/corpora" element={<CorpusRegistry />} />
              {legacyApiUrl && (
                <Route path={legacyDocPath} element={<APIDoc />} />
              )}
              <Route path="/sparql" element={<SparqlUi />} />
            </Routes>
          </Suspense>
        </div>
      </DracorContext.Provider>
    </BrowserRouter>
  );
};

export default App;
