import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';

class Yarkho extends Component {
  render () {
    const {segments} = this.props;

    const data = {
      datasets: [
        {
          label: 'Speech distribution (as described in Yarkho 1997)',
          fill: false,
          backgroundColor: 'rgba(179,181,198,1)',
          borderColor: 'rgba(179,181,198,1)',
          borderDash: [],
          borderDashOffset: 0.0,
          pointBorderColor: 'rgba(179,181,198,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(179,181,198,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          lineTension: 0,
          data: []
        }
      ]
    };

    const options = {
      scales: {
        xAxes: [{
          type: 'category',
          scaleLabel: {
            labelString: 'number of characters per scene (monologues, dialogues, polylogues)',
            display: true
          }
        }],
        yAxes: [{
          type: 'linear',
          beginAtZero: true,
          ticks: {beginAtZero: true},
          scaleLabel: {
            labelString: 'number of scenes',
            display: true
          }
        }]
      }
    };

    const yarkho = {};

    segments.forEach(seg => {
      const numSpeakers = seg.speakers ? seg.speakers.length : 0;
      if (numSpeakers > 0) {
        if (yarkho[numSpeakers]) {
          yarkho[numSpeakers]++;
        } else {
          yarkho[numSpeakers] = 1;
        }
      }
    });

    options.scales.xAxes[0].labels = Object.keys(yarkho);
    data.datasets[0].data = Object.keys(yarkho).map(k => yarkho[k]);

    return <Line data={data} options={options}/>;
  }
}

Yarkho.propTypes = {
  segments: PropTypes.array.isRequired
};

export default Yarkho;
