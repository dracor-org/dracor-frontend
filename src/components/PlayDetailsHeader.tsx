import {
  useLayoutEffect,
  useState,
  use,
  type ReactElement,
  type ReactNode,
} from 'react';
import {IdCopy, IdLink, Years} from '@dracor/react';
import AuthorInfoImpl from './AuthorInfo';
import CorpusLabel from './CorpusLabel';
import {DracorContext} from '../context';
import type {Author, Play} from '../types';

// AuthorInfo is still a .jsx file — its inferred prop shape requires
// `fullname`, but our typed Author has it optional. Wrap the untyped
// export in a typed shim until the upstream @dracor/react AuthorInfo
// grows translator-role support and we can swap it in.
const AuthorInfo = AuthorInfoImpl as (props: {author: Author}) => ReactElement;

interface Props {
  play: Play;
  children?: ReactNode;
}

export default function PlayDetailsHeader({play, children}: Props) {
  const {
    id,
    authors,
    editors = [],
    corpus,
    title,
    subtitle,
    wikidataId,
    yearPremiered,
    yearPrinted,
    yearWritten,
  } = play;

  const translators = editors.filter((e) => e.role === 'translator');

  const {corpora} = use(DracorContext);
  const {acronym} =
    (corpora as {name: string; acronym?: string}[]).find(
      (c) => c.name === corpus
    ) || {};

  // Sticky-collapse detection: trip only once the page has scrolled to
  // the bottom of its overflow window. PlayDetailsTab is sized with
  // `calc(100vh - sticky_bar - pad*3 + 1px)` so total scroll room is
  // effectively 1px — matching the pre-Phase-2 react-stickynode
  // behaviour where any scroll fired the .active state.
  const [stuck, setStuck] = useState(false);
  useLayoutEffect(() => {
    function check() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      // eslint-disable-next-line react-x/set-state-in-effect
      setStuck(max > 0 && window.scrollY >= max - 1);
    }
    check();
    window.addEventListener('scroll', check, {passive: true});
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <div className="text-white bg-primary pt-4 z-[1]">
      <div className="flex gap-8 relative px-4 max-md:flex-col max-md:gap-4">
        <div className="min-w-[36ch] max-w-[50%] max-md:max-w-none">
          <h1 className="text-5xl leading-none underline decoration-secondary-100 decoration-[0.1em] mb-0">
            {title}
          </h1>
          {subtitle && (
            <h2 className="m-0 pt-4 text-[1.3em] font-normal italic">
              {subtitle}
            </h2>
          )}
          <span className="block mt-4">
            {id && (
              <IdCopy
                icon="dracor"
                uri={`https://dracor.org/id/${id}`}
                className="mr-4 text-secondary-200 hover:text-[#0056b3] transition-colors"
              >
                {id}
              </IdCopy>
            )}
            {wikidataId && (
              <span className="mr-4">
                <IdLink>{`wikidata:${wikidataId}`}</IdLink>
              </span>
            )}
            <span className="whitespace-nowrap align-text-bottom [&_span]:mr-4">
              {/* Years' props are typed as `number` upstream, but its
                  formatYear handles string forms too. */}
              <Years
                written={yearWritten as unknown as number}
                premiere={yearPremiered as unknown as number}
                print={yearPrinted as unknown as number}
              />
            </span>
          </span>
        </div>
        <div
          className="flex flex-wrap gap-8 min-w-[50%] overflow-x-auto max-md:flex-col max-md:gap-4 max-md:mb-4"
          style={{scrollbarWidth: 'none'}}
        >
          {authors.map((a: Author) => (
            <AuthorInfo key={`author-${a.fullname}`} author={a} />
          ))}
          {translators.map((t: Author) => (
            <AuthorInfo key={`translator-${t.fullname}`} author={t} />
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-primary px-4">
        {/* Fixed-height header row: the enlarged CorpusLabel + collapsed
            heading fit inside `h-[3.6em]` at max size, so the sticky
            bar's flow height stays constant regardless of `stuck`. That
            avoids a scroll-triggered feedback loop where growing the
            bar would push scrollHeight up and unlatch the trigger. */}
        <div className="flex gap-4 pt-3 h-[3.6em] overflow-hidden">
          {/* Enlarge CorpusLabel when stuck by boosting the font-size
              on its inner <a>. Setting size on the outer wrapper
              wouldn't win because CorpusLabel's span carries `text-lg`
              (a rem value insensitive to em inheritance). */}
          <span
            className={`leading-none [&_a]:transition-[font-size] [&_a]:duration-200 ${
              stuck ? '[&_a]:text-[1.6em]' : ''
            }`}
          >
            <CorpusLabel name={corpus} acronym={acronym} />
          </span>
          <div
            className={`inline-flex flex-col transition-opacity duration-200 ${
              stuck ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!stuck}
          >
            <h1 className="text-lg leading-none underline decoration-secondary-100 decoration-[0.1em] m-0">
              {title}
            </h1>
            <span
              className={
                'inline-flex flex-wrap items-baseline gap-x-2 mt-1 ' +
                '[&_h3]:m-0 [&_h3]:font-normal [&_h3]:text-sm ' +
                "[&_h3:not(:first-of-type)]:before:content-['·'] " +
                '[&_h3:not(:first-of-type)]:before:mr-2'
              }
            >
              {authors.map((a: Author) => (
                <h3 key={`author-${a.fullname}`}>{a.fullname}</h3>
              ))}
              {translators.map((t: Author) => (
                <h3
                  key={`translator-${t.fullname}`}
                  className="italic opacity-85"
                >
                  transl. {t.fullname}
                </h3>
              ))}
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
