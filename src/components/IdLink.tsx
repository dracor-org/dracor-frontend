import classnames from 'classnames/bind';
import style from './IdLink.module.scss';

const cx = classnames.bind(style);

type IdTypes = 'isni' | 'pnd' | 'wikidata';

const types = {
  isni: {
    label: 'ISNI',
    url: 'https://isni.org/isni/',
  },
  pnd: {
    label: 'PND',
    url: 'https://d-nb.info/gnd/',
  },
  wikidata: {
    label: 'Wikidata',
    url: 'https://www.wikidata.org/wiki/',
  },
};

interface Props {
  children: string;
  className?: string;
  button?: boolean;
  showLabel?: boolean;
};

const IdLink = ({button, children, className, showLabel}: Props) => {
  const mainClass = cx(className, 'main', {button});

  const matches = children.match(/^(wikidata|pnd|isni):([a-z\d]+)$/i);
  if (!matches) {
    return <span className={mainClass}>{children}</span>;
  }

  const type = matches[1].toLowerCase();
  const id = matches[2];
  const {url, label} = types[type as IdTypes];

  return (
    <span className={mainClass}>
      {showLabel && `${label}: `}
      <a className={cx(type)} href={`${url}${id}`} title={label}>
        {id}
      </a>
    </span>
  );
};

export default IdLink;
