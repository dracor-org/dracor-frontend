import {Play, Segment} from '../types';

interface TreeSegment {
  title: string;
  segments: TreeSegment[];
  n?: number;
  speakers?: string[];
}

function branch(
  level: TreeSegment[],
  title: string,
  n?: number,
  speakers?: string[]
) {
  const seg = level.find((s) => s.title === title && (!n || n === s.n));
  if (seg) {
    return seg.segments;
  }
  const newSeg: TreeSegment = {title, segments: []};
  if (n) {
    newSeg.n = n;
  }
  if (speakers) {
    newSeg.speakers = speakers;
  }
  level.push(newSeg);
  return newSeg.segments;
}

function buildTree(segments: Segment[], map: CastMap) {
  const tree: TreeSegment[] = segments.reduce((acc: TreeSegment[], segment) => {
    const title = segment.title || `[#${segment.number}]`;
    const parts = title.split(' | ');
    let level: TreeSegment[] = acc;
    parts.forEach((p, i) => {
      if (i === parts.length - 1) {
        const {speakers = []} = segment;
        level = branch(
          level,
          p,
          segment.number,
          speakers.map((s) => map[s])
        );
      } else {
        level = branch(level, p);
      }
    });
    return acc;
  }, []);
  return tree;
}

interface CastMap {
  [id: string]: string;
}

interface Props {
  play: Play;
}

const Segments = ({play: {characters, segments}}: Props) => {
  const castMap: CastMap = characters.reduce((map: CastMap, member) => {
    map[member.id] = member.name;
    return map;
  }, {});

  const tree = buildTree(segments, castMap);

  return (
    <div className="segments-wrapper relative flex w-full">
      <h4 className="absolute top-0 left-0 right-4 bg-neutral-100 h-[2em] pointer-events-none z-10">
        Segments
      </h4>
      <ol
        className="w-full overflow-y-auto pt-16 pb-4 mb-0 pl-0 list-none font-bold"
        style={{scrollbarWidth: 'thin'}}
      >
        {tree.map((segment) => (
          <Seg key={segment.title} seg={segment} />
        ))}
      </ol>
    </div>
  );
};

const Seg = ({seg}: {seg: TreeSegment}) => (
  <li className="mb-1">
    <p className="mb-0 group">
      {seg.title}
      {seg.n && (
        <>
          {' '}
          <span className="text-gray-500 hidden group-hover:inline">
            #{seg.n}
          </span>
        </>
      )}
    </p>
    {seg.segments.length > 0 && (
      <ol className="mt-2 mb-4 pl-4 list-none font-normal">
        {seg.segments.map((s) => (
          <Seg key={`${s.n}-${s.title}`} seg={s} />
        ))}
      </ol>
    )}
    {seg.speakers && (
      <i className="text-[80%] font-normal">{seg.speakers.join(', ')}</i>
    )}
  </li>
);

export default Segments;
