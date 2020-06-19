import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import Sapogov from './SpeechDistribution/Sapogov';
import Yarkho from './SpeechDistribution/Yarkho';
import TrilckeFischer from './SpeechDistribution/TrilckeFischer';

const SpeechDistribution = ({groups, segments}) => {
  const [chartType, setChartType] = useState('trilckefischer');

  let chart;
  if (chartType === 'yarkho') {
    chart = <Yarkho {...{groups, segments}}/>;
  } else if (chartType === 'trilckefischer') {
    chart = <TrilckeFischer {...{segments}}/>;
  } else {
    chart = <Sapogov {...{groups, segments}}/>;
  }

  const handleChange = e => setChartType(e.target.value);

  return (
    <div style={{width: '100%'}}>
      <Form>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              value="sapogov"
              checked={chartType === 'sapogov'}
              onChange={handleChange}
            /> Sapogov
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              value="yarkho"
              checked={chartType === 'yarkho'}
              onChange={handleChange}
            /> Yarkho
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              value="trilckefischer"
              checked={chartType === 'trilckefischer'}
              onChange={handleChange}
            /> Trilcke/Fischer et al.
          </Label>
        </FormGroup>
      </Form>
      <br/>

      <div className="speech-dist-container d-flex">
        <div style={{position: 'relative', width: '100%'}}>
          {chart}
        </div>
      </div>
    </div>
  );
};

SpeechDistribution.propTypes = {
  groups: PropTypes.array.isRequired,
  segments: PropTypes.array.isRequired
};

export default SpeechDistribution;
