import {useEffect, useRef} from 'react';
import axios from 'axios';
import {guidelinesUrl} from '../config';
import './Odd.scss';

const Odd = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMarkdown() {
      const html = document.createElement('html');
      try {
        const response = await axios.get(guidelinesUrl);
        while (ref.current?.firstChild) {
          ref.current.removeChild(ref.current.firstChild);
        }
        if (response.status === 200) {
          html.innerHTML = response.data;
          html.querySelectorAll('body > div').forEach((div) => {
            ref.current?.appendChild(div);
          });
        } else {
          // eslint-disable-next-line no-console
          console.log('Cannot load html, status: %s', response.status);
          const p = document.createElement('p');
          p.append('Failed to load ODD file.');
          ref.current?.appendChild(p);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    fetchMarkdown();
  }, []);

  return (
    <div ref={ref} className="odd-wrapper">
      <p>Loading...</p>
    </div>
  );
};

export default Odd;
