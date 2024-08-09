import {Component} from 'react';
import {Line} from 'react-chartjs-2';

class Sapogov extends Component {
  render() {
    const {groups, segments} = this.props;
    const data = {
      datasets: [
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
          data: [],
        },
      ],
    };

    if (groups.length > 0) {
      data.datasets.push({
        label: 'non-group characters only',
        fill: true,
        backgroundColor: '#61affe1a',
        borderColor: '#61affe',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#61affe',
        pointHoverBorderColor: '#1F2448',
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      });
    }

    const options = {
      scales: {
        xAxes: [
          {
            type: 'category',
            scaleLabel: {
              labelString: 'number of scene',
              display: true,
            },
          },
        ],
        yAxes: [
          {
            type: 'linear',
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              labelString: 'number of characters',
              display: true,
            },
          },
        ],
      },
    };

    const labels = [];

    segments.forEach((seg, i) => {
      const n = i + 1;
      const numSpeakers = seg.speakers ? seg.speakers.length : 0;
      labels.push(n);
      // labels.push(seg.title ? seg.title.split(' | ') : n);
      data.datasets[0].data.push(numSpeakers);

      if (groups.length > 0) {
        const speakers = seg.speakers || [];
        const numNonGroups = speakers.filter(
          (id) => groups.indexOf(id) === -1
        ).length;
        data.datasets[1].data.push(numNonGroups);
      }
    });

    options.scales.xAxes[0].labels = labels;

    // adjust step size to avoid decimal numbers but still take advantage of the
    // nice numbers algorithm when numbers are higher (see
    // http://www.chartjs.org/docs/latest/axes/radial/linear.html#step-size)
    let max = 0;
    data.datasets[0].data.forEach((n) => {
      if (n > max) {
        max = n;
      }
    });
    if (max < 10) {
      options.scales.yAxes[0].ticks.stepSize = 1;
    }

    return <Line data={data} options={options} />;
  }
}

export default Sapogov;
