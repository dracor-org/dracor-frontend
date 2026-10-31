// The `/vitest` entry point is what registers the matcher types with
// Vitest's `expect`; the bare import stopped doing so in jest-dom 7.
import '@testing-library/jest-dom/vitest';
import {afterAll, afterEach, beforeAll} from 'vitest';
import {server} from './mocks/server';

// msw 3 renamed `onUnhandledRequest` to `onUnhandledFrame` — it now covers
// WebSocket connections too. Any fetch a test doesn't mock still fails loudly.
beforeAll(() => server.listen({onUnhandledFrame: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Two gaps in jsdom keep recharts from drawing anything: every element
// measures 0x0, and there is no ResizeObserver — ResponsiveContainer bails
// out early when the latter is missing, so it never measures at all.
//
// Only the responsive container gets a size. Sizing *every* element breaks
// the charts in a subtler way: the legend then measures the full height and
// leaves no room for the plot area.
const BOX = {width: 800, height: 453};
const nativeGetBoundingClientRect = Element.prototype.getBoundingClientRect;

Element.prototype.getBoundingClientRect = function () {
  if (!this.classList?.contains('recharts-responsive-container')) {
    return nativeGetBoundingClientRect.call(this);
  }
  return {
    ...BOX,
    top: 0,
    left: 0,
    bottom: BOX.height,
    right: BOX.width,
    x: 0,
    y: 0,
    toJSON() {
      return {...BOX};
    },
  } as DOMRect;
};

globalThis.ResizeObserver = class ResizeObserver {
  constructor(private callback: ResizeObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: target.getBoundingClientRect(),
        } as ResizeObserverEntry,
      ],
      this
    );
  }
  unobserve() {}
  disconnect() {}
};

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
