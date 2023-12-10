import {useEffect, useRef} from 'react';
import axios from 'axios';
import classnames from 'classnames/bind';
import style from './Odd.module.scss';
import './Odd.scss';

const cx = classnames.bind(style);
const url = '/odd.html';

const Odd = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMarkdown() {
      const html = document.createElement('html');
      try {
        const response = await axios.get(url);
        while (ref.current?.firstChild) {
          ref.current.removeChild(ref.current.firstChild);
        }
        if (response.status === 200) {
          html.innerHTML = response.data;
          html.querySelectorAll('body > div').forEach((div) => {
            ref.current?.appendChild(div);
          });
        } else {
          console.log('Cannot load html, status: %s', response.status);
          const p = document.createElement('p');
          p.append('Failed to load ODD file.');
          ref.current?.appendChild(p);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMarkdown();
  }, []);

  return (
    <div ref={ref} className={cx('main')}>
      <p>Loading...</p>
    </div>
  );
};

export default Odd;
