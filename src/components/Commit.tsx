import classnames from 'classnames/bind';
import style from './Commit.module.scss';

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
        <a href={url} target="_blank" title="Git commit">
          {short}
        </a>
      )}
      {!repo && <span title="Git commit">{short}</span>}
    </>
  );
}
