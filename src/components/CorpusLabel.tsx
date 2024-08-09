import {Link} from 'react-router-dom';
import classnames from 'classnames/bind';
import style from './CorpusLabel.module.scss';

const cx = classnames.bind(style);

interface Props {
  name: string;
  title?: string;
  acronym?: string;
}

const CorpusLabel = ({name, title, acronym}: Props) => {
  const prefix = acronym
    ? acronym.replace('DraCor', '')
    : name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <span className={cx('main')}>
      <Link to={`/${name}`} title={title || 'Corpus'}>
        <em>{prefix}</em>DraCor
      </Link>
    </span>
  );
};

export default CorpusLabel;
