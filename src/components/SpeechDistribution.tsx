import Sapogov from './SpeechDistribution/Sapogov';
import Yarkho from './SpeechDistribution/Yarkho';
import TrilckeFischer from './SpeechDistribution/TrilckeFischer';
import {Segment} from '../types';

interface NavProps {
  type: string;
  onChange: (type: string) => void;
}

function Radio({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-auto accent-primary"
      />
      <span>{children}</span>
    </label>
  );
}

export const SpeechDistributionNav = ({type, onChange}: NavProps) => {
  return (
    <div>
      <p>This tab shows different ways of visualising speech distribution.</p>
      <div className="flex flex-col gap-1">
        <Radio
          name="speech-dist"
          value="sapogov"
          checked={type === 'sapogov'}
          onChange={onChange}
        >
          Sapogov{' '}
          <a href="https://www.zotero.org/groups/940512/dlina/items/itemKey/BU7ZB3LY">
            1974
          </a>
        </Radio>
        <Radio
          name="speech-dist"
          value="yarkho"
          checked={type === 'yarkho'}
          onChange={onChange}
        >
          Yarkho{' '}
          <a href="http://rvb.ru/philologica/04/04iarxo.htm">1997 (ru)</a>
          {', '}
          <a href="https://doi.org/10.1515/jlt-2019-0002">2019 (en)</a>
        </Radio>
        <Radio
          name="speech-dist"
          value="trilckefischer"
          checked={type === 'trilckefischer'}
          onChange={onChange}
        >
          Trilcke/Fischer et al.{' '}
          <a href="https://dh2017.adho.org/abstracts/071/071.pdf">2017</a>
        </Radio>
      </div>
    </div>
  );
};

interface Props {
  type: string;
  groups: string[];
  segments: Segment[];
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
    <div className="w-full">
      <div className="flex">
        <div className="relative w-full">{chart}</div>
      </div>
    </div>
  );
};

export default SpeechDistribution;
