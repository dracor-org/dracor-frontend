import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type {Segment} from '../../types';
import {
  AXIS_LABEL,
  AXIS_TICK,
  CHART_HEIGHT,
  PRIMARY,
  SECONDARY,
  areaProps,
} from './chart';

interface Props {
  groups: string[];
  segments: Segment[];
}

export default function Yarkho({groups, segments}: Props) {
  const hasGroups = groups.length > 0;

  const yarkho: Record<number, number> = {};
  const nonGroups: Record<number, number> = {};
  let maxSpeakers = 0;

  segments.forEach((seg) => {
    const speakers = seg.speakers || [];
    const numSpeakers = speakers.length;
    const numNonGroups = speakers.filter((id) => !groups.includes(id)).length;

    if (numSpeakers > 0) {
      yarkho[numSpeakers] = (yarkho[numSpeakers] ?? 0) + 1;
    }
    if (numNonGroups > 0) {
      nonGroups[numNonGroups] = (nonGroups[numNonGroups] ?? 0) + 1;
    }
    if (numSpeakers > maxSpeakers) {
      maxSpeakers = numSpeakers;
    }
  });

  // Interpolate zeros for those mono/polylogues below the maximum number of
  // speakers that don't occur, so the line doesn't skip over them.
  for (let n = 1; n < maxSpeakers; n++) {
    if (!yarkho[n]) yarkho[n] = 0;
    if (!nonGroups[n]) nonGroups[n] = 0;
  }

  const data = Object.keys(yarkho)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({
      speakers: n,
      scenes: yarkho[n],
      nonGroupScenes: nonGroups[n] ?? 0,
    }));

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <AreaChart
        data={data}
        margin={{top: 10, right: 20, bottom: 20, left: 10}}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="speakers"
          type="number"
          domain={[1, Math.max(1, maxSpeakers)]}
          allowDecimals={false}
          tick={AXIS_TICK}
          label={{
            ...AXIS_LABEL,
            value:
              'number of characters per scene (monologues, dialogues, polylogues)',
            position: 'insideBottom',
            offset: -12,
          }}
        />
        <YAxis
          allowDecimals={false}
          tick={AXIS_TICK}
          label={{
            ...AXIS_LABEL,
            value: 'number of scenes',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Tooltip
          labelFormatter={(v) =>
            `${v} character${v === 1 ? '' : 's'} per scene`
          }
        />
        <Legend verticalAlign="top" wrapperStyle={{fontSize: 12}} />
        <Area
          dataKey="scenes"
          name="Speech distribution (as described in Yarkho 1997)"
          {...areaProps(PRIMARY)}
        />
        {hasGroups ? (
          <Area
            dataKey="nonGroupScenes"
            name="non-group characters only"
            {...areaProps(SECONDARY)}
          />
        ) : null}
      </AreaChart>
    </ResponsiveContainer>
  );
}
