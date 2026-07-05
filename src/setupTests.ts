import '@testing-library/jest-dom';
import {afterAll, afterEach, beforeAll} from 'vitest';
import {server} from './mocks/server';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
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
