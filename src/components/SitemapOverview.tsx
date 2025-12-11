import {useContext} from 'react';
import {Link} from 'react-router-dom';
import classnames from 'classnames/bind';
import {DracorContext} from '../context';
import {SitemapNode} from '../types';
import style from './SitemapOverview.module.scss';

const cx = classnames.bind(style);

const SitemapOverview = () => {
  const {sitemap = []} = useContext(DracorContext);
  const nodes = sitemap.filter(
    (entry): entry is SitemapNode => 'items' in entry
  );

  return (
    <div className={cx('main')}>
      {nodes.map((node) => (
        <div key={node.label}>
          <h5>{node.label}</h5>
          <ul>
            {node.items
              .filter(
                (item): item is {label: string; href: string} => 'href' in item
              )
              .map((item) => (
                <li key={item.label}>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SitemapOverview;
