import {use} from 'react';
import {Link} from '@tanstack/react-router';
import {DracorContext} from '../context';
import {SitemapNode} from '../types';

export default function SitemapOverview() {
  const {sitemap = []} = use(DracorContext);
  const nodes = sitemap.filter(
    (entry): entry is SitemapNode => 'items' in entry
  );

  return (
    <div className="flex flex-wrap gap-4 w-full p-4 bg-neutral-200">
      {nodes.map((node) => (
        <div
          key={node.label}
          className="flex-1 pl-1 max-md:flex-[0_0_calc(50%-1em)]"
        >
          <h5 className="uppercase">{node.label}</h5>
          <ul className="list-none m-0 pl-0">
            {node.items
              .filter(
                (item): item is {label: string; href: string} => 'href' in item
              )
              .map((item) => (
                <li key={item.label}>
                  {/* Sitemap hrefs are dynamic strings from an external
                      JSON manifest; TanStack Router's typed `to` can't
                      express them. Cast at this boundary. */}
                  <Link to={item.href as never}>{item.label}</Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
