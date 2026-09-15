import {DownloadButton} from '@dracor/react';
import {apiUrl} from '../loaders';
import {Play} from '../types';

const DownloadLinks = ({play}: {play: Play}) => {
  const playUrl = `${apiUrl}/corpora/${play.corpus}/plays/${play.name}`;
  const stem = `${play.id}-${play.name}`;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(17em,1fr))] xl:grid-cols-[repeat(3,minmax(15em,1fr))] gap-8 w-full h-auto overflow-y-auto [&_h4]:p-0 [&_h4]:leading-none">
      <span>
        <h4>Network data</h4>
        <p>Co-occurrence network:</p>
        <span className="flex flex-wrap gap-4">
          <DownloadButton
            href={`${playUrl}/networkdata/csv`}
            name={`${stem}.network.csv`}
            type="csv"
          />
          <DownloadButton
            href={`${playUrl}/networkdata/gexf`}
            name={`${stem}.network.gexf`}
            type="gexf"
          />
          <DownloadButton
            href={`${playUrl}/networkdata/graphml`}
            name={`${stem}.network.graphml`}
            type="graphml"
          />
        </span>
        {play.relations ? (
          <>
            <p>
              Relation data (as described{' '}
              <a href="https://github.com/dracor-org/gerdracor#character-relations">
                here
              </a>
              ):
            </p>
            <span className="flex flex-wrap gap-4">
              <DownloadButton
                href={`${playUrl}/relations/csv`}
                name={`${stem}.relations.csv`}
                type="csv"
              />
              <DownloadButton
                href={`${playUrl}/relations/gexf`}
                name={`${stem}.relations.gexf`}
                type="gexf"
              />
              <DownloadButton
                href={`${playUrl}/relations/graphml`}
                name={`${stem}.relations.graphml`}
                type="graphml"
              />
            </span>
          </>
        ) : (
          <p>Relation data not available.</p>
        )}
      </span>
      <span>
        <h4>Spoken text</h4>
        <p>By character:</p>
        <span className="flex flex-wrap gap-4">
          <DownloadButton
            href={`${playUrl}/spoken-text-by-character`}
            name={`${stem}.spoken-text-by-character.json`}
            type="json"
          />
        </span>
        <p>Plain (no markup):</p>
        <span className="flex flex-wrap gap-4">
          <DownloadButton
            href={`${playUrl}/spoken-text`}
            name={`${stem}.spoken-text.txt`}
            type="txt"
          />
        </span>
      </span>
      <span>
        <h4>Stage directions</h4>
        <p>Without speaker names:</p>
        <span className="flex flex-wrap gap-4">
          <DownloadButton
            href={`${playUrl}/stage-directions`}
            name={`${stem}.stage-directions.txt`}
            type="txt"
          />
        </span>
        <p>Including speaker names:</p>
        <span className="flex flex-wrap gap-4">
          <DownloadButton
            href={`${playUrl}/stage-directions-with-speakers`}
            name={`${stem}.stage-directions-with-speakers.txt`}
            type="txt"
          />
        </span>
      </span>
      <span>
        <h4>List of characters</h4>
        <p>Including precalculated data:</p>
        <span className="flex flex-wrap gap-4">
          <DownloadButton
            href={`${playUrl}/characters/csv`}
            name={`${stem}.characters.csv`}
            type="csv"
          />
          <DownloadButton
            href={`${playUrl}/characters`}
            name={`${stem}.characters.json`}
            type="json"
          />
        </span>
      </span>
      <span>
        <h4>Full text</h4>
        <p>TEI-encoded:</p>
        <span className="flex flex-wrap gap-4">
          <DownloadButton
            href={`${playUrl}/tei`}
            name={`${stem}.tei.xml`}
            type="tei"
          />
        </span>
      </span>
    </div>
  );
};

export default DownloadLinks;
