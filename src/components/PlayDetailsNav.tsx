import {Tabs} from '@dracor/react';
import type {ComponentProps} from 'react';

interface Item {
  name: string;
  label: string;
}

interface Props {
  items: Item[];
  corpusId: string;
  playId: string;
}

export default function PlayDetailsNav({items, corpusId, playId}: Props) {
  // @dracor/react 1.7.0's Tabs only forwards `to` to its Link and drops
  // `params`, so build a resolved path string here. Fix is in flight
  // (dracor-org/dracor-react#87) — drop this workaround once released.
  const data: ComponentProps<typeof Tabs>['data'] = items.map((item) => ({
    label: item.label || item.name,
    to: `/${corpusId}/${playId}/${item.name}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;
  return <Tabs data={data} />;
}
