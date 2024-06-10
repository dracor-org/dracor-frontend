import classnames from 'classnames/bind';
import style from './Commit.module.scss';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const cx = classnames.bind(style);

export interface Props {
  repo?: string;
  children: string;
}

export default function Commit({repo, children}: Props) {
  const sha = children.trim();
  const short = sha.substring(0, 8);
  const url = `${repo}/commit/${sha}`;

  return (
    <>
      {repo && (
        <a href={url} target="_blank">
          <FontAwesomeIcon icon={faGithub} size="lg" className={cx('icon')} />
          {short}
        </a>
      )}
      {!repo && <span title="Git commit">{short}</span>}
    </>
  );
}
