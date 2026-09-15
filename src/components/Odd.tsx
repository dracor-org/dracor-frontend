import {useEffect, useRef} from 'react';
import {guidelinesUrl} from '../config';
import './Odd.scss';

const Odd = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchOdd() {
      const html = document.createElement('html');
      try {
        const response = await fetch(guidelinesUrl);
        while (ref.current?.firstChild) {
          ref.current.removeChild(ref.current.firstChild);
        }
        if (response.ok) {
          html.innerHTML = await response.text();
          html.querySelectorAll('body > div').forEach((div) => {
            ref.current?.appendChild(div);
          });
          if (window.location.hash) {
            const el = document.querySelector(window.location.hash);
            if (el) {
              el.scrollIntoView({behavior: 'smooth'});
            }
          }
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

    fetchOdd();
  }, []);

  return (
    <div ref={ref} className="odd-wrapper">
      <p>Loading...</p>
    </div>
  );
};

export default Odd;
