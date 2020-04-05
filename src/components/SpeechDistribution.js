import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, FormGroup, Label, Input} from 'reactstrap';
import Sapogov from './SpeechDistribution/Sapogov';
import Yarkho from './SpeechDistribution/Yarkho';

const SpeechDistribution = ({groups, segments}) => {
  const [chartType, setChartType] = useState('sapogov');

  let chart;
  if (chartType === 'yarkho') {
    chart = <Yarkho {...{groups, segments}}/>;
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
      </Form>
      <br/>
      {chart}
    </div>
  );
};

SpeechDistribution.propTypes = {
  groups: PropTypes.array.isRequired,
  segments: PropTypes.array.isRequired
};

export default SpeechDistribution;
