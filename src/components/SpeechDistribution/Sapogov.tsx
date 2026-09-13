import {Line} from 'react-chartjs-2';
import type {Segment} from '../../types';

interface Props {
  groups: string[];
  segments: Segment[];
}

export default function Sapogov({groups, segments}: Props) {
  const datasets: Record<string, unknown>[] = [
    {
      label: 'Speech distribution (as described in Sapogov 1974)',
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
      data: [] as number[],
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
      data: [] as number[],
    });
  }

  const labels: number[] = [];

  segments.forEach((seg, i) => {
    const n = i + 1;
    const numSpeakers = seg.speakers ? seg.speakers.length : 0;
    labels.push(n);
    (datasets[0].data as number[]).push(numSpeakers);

    if (groups.length > 0) {
      const speakers = seg.speakers || [];
      const numNonGroups = speakers.filter(
        (id) => groups.indexOf(id) === -1
      ).length;
      (datasets[1].data as number[]).push(numNonGroups);
    }
  });

  const yTicks: Record<string, unknown> = {beginAtZero: true};

  // adjust step size to avoid decimal numbers but still take advantage of the
  // nice numbers algorithm when numbers are higher (see
  // http://www.chartjs.org/docs/latest/axes/radial/linear.html#step-size)
  const max = Math.max(0, ...(datasets[0].data as number[]));
  if (max < 10) {
    yTicks.stepSize = 1;
  }

  const options = {
    scales: {
      xAxes: [
        {
          type: 'category',
          labels,
          scaleLabel: {
            labelString: 'number of scene',
            display: true,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          ticks: yTicks,
          scaleLabel: {
            labelString: 'number of characters',
            display: true,
          },
        },
      ],
    },
  };

  return <Line data={{datasets}} options={options} />;
}
