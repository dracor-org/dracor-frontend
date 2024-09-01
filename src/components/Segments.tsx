import classnames from 'classnames/bind';
import {Play, Segment} from '../types';
import style from './Segments.module.scss';

const cx = classnames.bind(style);

interface TreeSegment {
  title: string;
  segments: TreeSegment[];
  speakers?: string[];
}

function branch(level: TreeSegment[], title: string, speakers?: string[]) {
  const seg = level.find((s) => s.title === title);
  if (seg) {
    return seg.segments;
  }
  const newSeg: TreeSegment = {title, segments: []};
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
    <div className={cx('main')}>
      <h4>Segments</h4>
      <ol className={cx('wrapper', 'dracor-scrollbar')}>
        {tree.map((segment) => (
          <Seg key={segment.title} seg={segment} />
        ))}
      </ol>
    </div>
  );
};

const Seg = ({seg}: {seg: TreeSegment}) => (
  <li>
    <p>{seg.title}</p>
    {seg.segments.length > 0 && (
      <ol>
        {seg.segments.map((s) => (
          <Seg key={s.title} seg={s} />
        ))}
      </ol>
    )}
    {seg.speakers && <i>{seg.speakers.join(', ')}</i>}
  </li>
);

export default Segments;
