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
