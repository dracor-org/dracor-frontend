import {useContext} from 'react';
import {version} from '../config';
import {DracorContext} from '../context';
import svgBibTex from '../images/bibtex.svg';
import svgRIS from '../images/ris.svg';
import svgCC0 from '../images/cc0.svg';
import SitemapOverview from './SitemapOverview';

const versionRe = /^\d+\.\d+\.\d+(-(alpha|beta)(\.\d+)?)?$/;

interface Props {
  withSitemap?: boolean;
}

const Footer = ({withSitemap = false}: Props) => {
  const {apiInfo} = useContext(DracorContext);

  const apiVersion = apiInfo?.version;
  const existdb = apiInfo?.existdb;

  const apiVersionUrl =
    apiVersion && versionRe.test(apiVersion)
      ? `https://github.com/dracor-org/dracor-api/releases/tag/${apiVersion}`
      : 'https://github.com/dracor-org/dracor-api/releases/';

  const frontendVersionUrl = versionRe.test(version)
    ? `https://github.com/dracor-org/dracor-frontend/releases/tag/${version}`
    : 'https://github.com/dracor-org/dracor-frontend/releases/';

  return (
    <div className="mt-12">
      {withSitemap && (
        <div className="flex flex-wrap">
          <SitemapOverview />
        </div>
      )}
      <div className="flex flex-wrap gap-6 bg-gradient-to-t from-[#ebf0f6] to-[#e3e8f1] px-4 py-3 text-sm/relaxed max-md:flex-col">
        <div className="flex flex-1 flex-wrap items-end">
          <h5 className="w-full whitespace-nowrap max-md:whitespace-normal">
            If you want to cite DraCor, <wbr />
            please use the following reference:
          </h5>
          <a href="/cite_dracor.bib" type="application/x-bibtex">
            <img
              src={svgBibTex}
              alt="BibTeX"
              className="h-20 pr-4 pt-1 transition-opacity duration-300 hover:opacity-85"
            />
          </a>
          <a href="/cite_dracor.ris" type="application/x-research-info-systems">
            <img
              src={svgRIS}
              alt="RIS"
              className="h-20 pr-4 pt-1 transition-opacity duration-300 hover:opacity-85"
            />
          </a>
          <p className="mb-0 flex-1 self-end">
            Fischer, Frank, et al. (2019). Programmable Corpora: Introducing
            DraCor, an Infrastructure for the Research on European Drama. In{' '}
            <em>Proceedings of DH2019: &quot;Complexities&quot;</em>, Utrecht
            University,{' '}
            <a
              href="https://doi.org/10.5281/zenodo.4284002"
              rel="noopener noreferrer"
              target="_blank"
            >
              doi:10.5281/zenodo.4284002
            </a>
            .
          </p>
        </div>
        <div className="flex-1 whitespace-nowrap text-right max-md:whitespace-normal max-md:text-left">
          <h5 className="whitespace-nowrap max-md:whitespace-normal">
            Drama Corpora Project
          </h5>
          <p className="mb-0">
            Unless otherwise stated, all corpora and the web design
            <br /> are released under Creative Commons{' '}
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0"
              rel="noopener noreferrer license"
              target="_blank"
            >
              0 1.0
            </a>
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0"
              rel="noopener noreferrer license"
              target="_blank"
            >
              <img src={svgCC0} alt="CC0" className="mb-1 ml-1 inline h-5" />
            </a>
          </p>
          {apiVersion && (
            <p className="api-info mb-0">
              <span className="version-pill">
                <span>DraCor Frontend</span>
                <a
                  href={frontendVersionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {version}
                </a>
              </span>{' '}
              <span className="version-pill">
                <span>DraCor API</span>
                <a
                  href={apiVersionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {apiVersion}
                </a>
              </span>{' '}
              <wbr />
              {existdb && (
                <span className="version-pill">
                  <span>eXist-db</span>
                  <a
                    href={`https://github.com/eXist-db/exist/releases/tag/eXist-${existdb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {existdb}
                  </a>
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
