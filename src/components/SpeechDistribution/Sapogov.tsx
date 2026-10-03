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

export default function Sapogov({groups, segments}: Props) {
  const hasGroups = groups.length > 0;

  const data = segments.map((seg, i) => {
    const speakers = seg.speakers || [];
    return {
      scene: i + 1,
      all: speakers.length,
      nonGroups: speakers.filter((id) => !groups.includes(id)).length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <AreaChart
        data={data}
        margin={{top: 10, right: 20, bottom: 20, left: 10}}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="scene"
          tick={AXIS_TICK}
          label={{
            ...AXIS_LABEL,
            value: 'number of scene',
            position: 'insideBottom',
            offset: -12,
          }}
        />
        <YAxis
          // Chart.js used stepSize to keep character counts whole; recharts
          // expresses the same intent directly and still picks nice numbers
          // for larger ranges.
          allowDecimals={false}
          tick={AXIS_TICK}
          label={{
            ...AXIS_LABEL,
            value: 'number of characters',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Tooltip labelFormatter={(v) => `Scene ${v}`} />
        <Legend verticalAlign="top" wrapperStyle={{fontSize: 12}} />
        <Area
          dataKey="all"
          name="Speech distribution (as described in Sapogov 1974)"
          {...areaProps(PRIMARY)}
        />
        {hasGroups ? (
          <Area
            dataKey="nonGroups"
            name="non-group characters only"
            {...areaProps(SECONDARY)}
          />
        ) : null}
      </AreaChart>
    </ResponsiveContainer>
  );
}
