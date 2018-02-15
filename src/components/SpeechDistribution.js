import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';

class SpeechDistribution extends Component {
  render () {
    const {segments} = this.props;

    const dataSapogov = {
      labels: [],
      datasets: [
        {
          label: 'Speakers per scene',
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

    const dataYarkho = {
      labels: [],
      datasets: [
        {
          label: 'Yarkho',
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

    const yarkho = {};

    segments.forEach((seg, i) => {
      const n = i + 1;
      const numSpeakers = seg.speakers ? seg.speakers.length : 0;
      dataSapogov.labels.push(n);
      dataSapogov.datasets[0].data.push(numSpeakers);
      if (numSpeakers > 0) {
        if (yarkho[numSpeakers]) {
          yarkho[numSpeakers]++;
        } else {
          yarkho[numSpeakers] = 1;
        }
      }
    });

    dataYarkho.labels = Object.keys(yarkho);
    dataYarkho.datasets[0].data = Object.keys(yarkho).map(k => yarkho[k]);

    return (
      <div className="speech-dist-container d-flex" style={{width: '100%'}}>
        <div style={{position: 'relative', width: '90%'}}>
          <Line data={dataSapogov}/>
        </div>
        <div style={{position: 'relative', width: '90%'}}>
          <Line data={dataYarkho} options={{elements: {line: {tension: 0}}}}/>
        </div>
      </div>
    );
  }
}

SpeechDistribution.propTypes = {
  segments: PropTypes.array.isRequired
};

export default SpeechDistribution;
