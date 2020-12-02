import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';

class Yarkho extends Component {
  render () {
    const {groups, segments} = this.props;

    const data = {
      datasets: [
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
          data: []
        }
      ]
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
        lineTension: 0,
        data: []
      });
    }

    const options = {
      scales: {
        xAxes: [{
          type: 'linear',
          display: true,
          ticks: {
            callback: value => Number.parseInt(value, 10),
            min: 1,
            stepSize: 1
          },
          scaleLabel: {
            labelString: 'number of characters per scene (monologues, dialogues, polylogues)',
            display: true
          }
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            labelString: 'number of scenes',
            display: true
          }
        }]
      }
    };

    const yarkho = {};
    const nonGroups = {};
    let maxSpeakers = 0;

    segments.forEach(seg => {
      const numSpeakers = seg.speakers ? seg.speakers.length : 0;
      const numNonGroups = numSpeakers ? seg.speakers.filter(
        id => !groups.includes(id)
      ).length : 0;

      if (numSpeakers > 0) {
        if (yarkho[numSpeakers]) {
          yarkho[numSpeakers]++;
        } else {
          yarkho[numSpeakers] = 1;
        }
      }

      if (numNonGroups > 0) {
        if (nonGroups[numNonGroups]) {
          nonGroups[numNonGroups]++;
        } else {
          nonGroups[numNonGroups] = 1;
        }
      }

      if (numSpeakers > maxSpeakers) {
        maxSpeakers = numSpeakers;
      }
    });

    // interpolate zeros for those mono/polylogues below the maximum number of
    // speakers that don't occur
    for (let n = 1; n < maxSpeakers; n++) {
      if (!yarkho[n]) {
        yarkho[n] = 0;
      }

      if (!nonGroups[n]) {
        nonGroups[n] = 0;
      }
    }

    data.datasets[0].data = Object.keys(yarkho).map(
      k => {
        return {x: Number.parseInt(k, 10), y: yarkho[k]};
      }
    );
    if (groups.length > 0) {
      data.datasets[1].data = Object.keys(nonGroups).map(
        k => {
          return {x: Number.parseInt(k, 10), y: nonGroups[k]};
        }
      );
    }

    // adjust step size to avoid decimal numbers but still take advantage of the
    // nice numbers algorithm when numbers are higher (see
    // http://www.chartjs.org/docs/latest/axes/radial/linear.html#step-size)
    let max = 0;
    data.datasets[0].data.forEach(n => {
      if (n > max) {
        max = n;
      }
    });
    if (max < 10) {
      options.scales.yAxes[0].ticks.stepSize = 1;
    }

    return (
      <>
        <Line data={data} options={options}/>
        <p>
          {'Cf. '}
          <a href="http://rvb.ru/philologica/04/04iarxo.htm">
            Yarkho 1997 (ru)
          </a>
          {', '}
          <a href="https://doi.org/10.1515/jlt-2019-0002">
            Yarkho 2019 (en)
          </a>
        </p>
      </>
    );
  }
}

Yarkho.propTypes = {
  groups: PropTypes.array.isRequired,
  segments: PropTypes.array.isRequired
};

export default Yarkho;
