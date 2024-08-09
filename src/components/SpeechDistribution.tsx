import {Form, FormGroup, Label, Input} from 'reactstrap';
import Sapogov from './SpeechDistribution/Sapogov';
import Yarkho from './SpeechDistribution/Yarkho';
import TrilckeFischer from './SpeechDistribution/TrilckeFischer';

const defaultType = 'trilckefischer';

interface NavProps {
  type: string;
  onChange: (type: string) => null;
}

export const SpeechDistributionNav = ({type, onChange}: NavProps) => {
  const handleChange = (e: any) => onChange(e.target.value);

  return (
    <div>
      <p>This tab shows different ways of visualising speech distribution.</p>
      <Form>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              value="sapogov"
              checked={type === 'sapogov'}
              onChange={handleChange}
            />{' '}
            Sapogov{' '}
            <a href="https://www.zotero.org/groups/940512/dlina/items/itemKey/BU7ZB3LY">
              1974
            </a>
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              value="yarkho"
              checked={type === 'yarkho'}
              onChange={handleChange}
            />{' '}
            Yarkho{' '}
            <a href="http://rvb.ru/philologica/04/04iarxo.htm">1997 (ru)</a>
            {', '}
            <a href="https://doi.org/10.1515/jlt-2019-0002">2019 (en)</a>
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              value="trilckefischer"
              checked={type === 'trilckefischer'}
              onChange={handleChange}
            />{' '}
            Trilcke/Fischer et al.{' '}
            <a href="https://dh2017.adho.org/abstracts/071/071.pdf">2017</a>
          </Label>
        </FormGroup>
      </Form>
    </div>
  );
};

interface Props {
  type: string;
  groups: any[];
  segments: any[];
}

const SpeechDistribution = ({type, groups, segments}: Props) => {
  let chart;
  if (type === 'yarkho') {
    chart = <Yarkho {...{groups, segments}} />;
  } else if (type === 'trilckefischer') {
    chart = <TrilckeFischer {...{segments}} />;
  } else {
    chart = <Sapogov {...{groups, segments}} />;
  }

  return (
    <div style={{width: '100%'}}>
      <div className="speech-dist-container d-flex">
        <div style={{position: 'relative', width: '100%'}}>{chart}</div>
      </div>
    </div>
  );
};

export default SpeechDistribution;
