import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Sapogov from './SpeechDistribution/Sapogov';
import Yarkho from './SpeechDistribution/Yarkho';

class SpeechDistribution extends Component {
  render () {
    const {segments} = this.props;

    return (
      <div className="speech-dist-container d-flex" style={{width: '100%'}}>
        <div style={{position: 'relative', width: '90%'}}>
          <Sapogov segments={segments}/>
        </div>
        <div style={{position: 'relative', width: '90%'}}>
          <Yarkho segments={segments}/>
        </div>
      </div>
    );
  }
}

SpeechDistribution.propTypes = {
  segments: PropTypes.array.isRequired
};

export default SpeechDistribution;
