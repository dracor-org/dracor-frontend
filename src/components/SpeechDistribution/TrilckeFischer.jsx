import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

function calcSegmentChangeRate(s1, s2) {
  const all = [...new Set(s1.concat(s2))];
  let edits = 0;
  s1.forEach((s) => {
    if (!s2.includes(s)) {
      edits += 1;
    }
  });
  s2.forEach((s) => {
    if (!s1.includes(s)) {
      edits += 1;
    }
  });
  const changeRate = edits / all.length;
  return changeRate;
}

function calcChangeRates(segments) {
  const changeRates = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const s1 = segments[i].speakers || [];
    const s2 = segments[i + 1].speakers || [];
    changeRates.push(calcSegmentChangeRate(s1, s2));
  }

  return changeRates;
}

const TrilckeFischer = ({segments}) => {
  const changeRates = calcChangeRates(segments);
  const dramaChangeRate =
    changeRates.reduce((acc, rate) => acc + rate, 0) / changeRates.length;

  const data = changeRates.map((rate, i) => {
    return {rate, transitionNum: i + 1};
  });

  return (
    <ResponsiveContainer width="100%" height={453}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="transitionNum"
          scale="point"
          label={{
            value: 'segment transition no.',
            position: 'insideBottom',
            color: 'green',
            fontSize: 12,
          }}
          tick={{
            fontSize: 10,
          }}
        />
        <YAxis
          label={{
            value: 'change rate',
            angle: -90,
            position: 'insideLeft',
            fontSize: 12,
          }}
          tick={{
            fontSize: 10,
          }}
        />
        <Tooltip labelFormatter={(v) => `Transition ${v}`} />
        <ReferenceLine
          y={dramaChangeRate}
          label={{
            value: `Drama Change Rate: ${dramaChangeRate.toFixed(3)}`,
            fill: '#1F2448',
            position: dramaChangeRate > 0.9 ? 'bottom' : 'top',
            fontSize: 12,
          }}
          stroke="#aaeeff"
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <Line
          dataKey="rate"
          stroke="#61affe"
          backgroundColor="#61affe1a"
          strokeWidth={3}
          activeDot={{r: 4}}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

TrilckeFischer.propTypes = {
  segments: PropTypes.array.isRequired,
};

export default TrilckeFischer;
