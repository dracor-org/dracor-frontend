import {Line} from 'react-chartjs-2';
import type {Segment} from '../../types';

interface Props {
  groups: string[];
  segments: Segment[];
}

interface Point {
  x: number;
  y: number;
}

export default function Yarkho({groups, segments}: Props) {
  const datasets: Record<string, unknown>[] = [
    {
      label: 'Speech distribution (as described in Yarkho 1997)',
      fill: true,
      backgroundColor: '#aaeeff1a',
      borderColor: '#aaeeff',
      borderDash: [],
      borderDashOffset: 0,
      pointBorderColor: '#aaeeff',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#aaeeff',
      pointHoverBorderColor: '#1F2448',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      lineTension: 0,
      data: [] as Point[],
    },
  ];

  if (groups.length > 0) {
    datasets.push({
      label: 'non-group characters only',
      fill: true,
      backgroundColor: '#61affe1a',
      borderColor: '#61affe',
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#61affe',
      pointHoverBorderColor: '#1F2448',
      pointRadius: 1,
      pointHitRadius: 10,
      lineTension: 0,
      data: [] as Point[],
    });
  }

  const yarkho: Record<number, number> = {};
  const nonGroups: Record<number, number> = {};
  let maxSpeakers = 0;

  segments.forEach((seg) => {
    const numSpeakers = seg.speakers ? seg.speakers.length : 0;
    const numNonGroups = numSpeakers
      ? seg.speakers!.filter((id) => !groups.includes(id)).length
      : 0;

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

  // interpolate zeros for those mono/polylogues below the maximum number of
  // speakers that don't occur
  for (let n = 1; n < maxSpeakers; n++) {
    if (!yarkho[n]) yarkho[n] = 0;
    if (!nonGroups[n]) nonGroups[n] = 0;
  }

  datasets[0].data = Object.keys(yarkho).map((k) => ({
    x: Number.parseInt(k, 10),
    y: yarkho[Number(k)],
  }));
  if (groups.length > 0) {
    datasets[1].data = Object.keys(nonGroups).map((k) => ({
      x: Number.parseInt(k, 10),
      y: nonGroups[Number(k)],
    }));
  }

  // The original JSX compared Point objects to a number, which always
  // evaluated false and left max = 0 — so stepSize: 1 was always applied.
  // Preserve that behavior explicitly.
  const yTicks: Record<string, unknown> = {beginAtZero: true, stepSize: 1};

  const options = {
    scales: {
      xAxes: [
        {
          type: 'linear',
          display: true,
          ticks: {
            callback: (value: number) => Number.parseInt(String(value), 10),
            min: 1,
            stepSize: 1,
          },
          scaleLabel: {
            labelString:
              'number of characters per scene (monologues, dialogues, polylogues)',
            display: true,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          ticks: yTicks,
          scaleLabel: {
            labelString: 'number of scenes',
            display: true,
          },
        },
      ],
    },
  };

  return <Line data={{datasets}} options={options} />;
}
