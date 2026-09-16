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
  //
  // `resetScroll: false` keeps the window scroll position when
  // switching between tabs (the default is to jump back to the top).
  const data: ComponentProps<typeof Tabs>['data'] = items.map((item) => ({
    label: item.label || item.name,
    to: `/${corpusId}/${playId}/${item.name}`,
    resetScroll: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;
  return (
    <div className="dracor-tabs">
      <Tabs data={data} />
    </div>
  );
}
