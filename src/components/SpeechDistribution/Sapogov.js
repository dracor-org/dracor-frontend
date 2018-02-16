import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';

class Sapogov extends Component {
  render () {
    const {segments} = this.props;

    const data = {
      datasets: [
        {
          label: 'Speech distribution (as described in Sapogov 1974)',
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
          data: []
        }
      ]
    };

    const options = {
      scales: {
        xAxes: [{
          type: 'category',
          scaleLabel: {
            labelString: 'number of scene',
            display: true
          }
        }],
        yAxes: [{
          type: 'linear',
          beginAtZero: true,
          ticks: {beginAtZero: true},
          scaleLabel: {
            labelString: 'number of characters',
            display: true
          }
        }]
      }
    };

    const labels = [];

    segments.forEach((seg, i) => {
      const n = i + 1;
      const numSpeakers = seg.speakers ? seg.speakers.length : 0;
      labels.push(n);
      //labels.push(seg.title ? seg.title.split(' | ') : n);
      data.datasets[0].data.push(numSpeakers);
    });

    options.scales.xAxes[0].labels = labels;

    return <Line data={data} options={options}/>;
  }
}

Sapogov.propTypes = {
  segments: PropTypes.array.isRequired
};

export default Sapogov;
