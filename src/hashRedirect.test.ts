import {migrateLegacyHash} from './hashRedirect';

function at(url: string) {
  window.history.replaceState(null, '', url);
}

afterEach(() => at('/'));

test('rewrites a legacy tab hash to a path segment', () => {
  at('/test/mustermann-mustertragoedie#tools');
  expect(migrateLegacyHash()).toBe('/test/mustermann-mustertragoedie/tools');
});

test('preserves the query string', () => {
  at('/test/some-play?foo=bar#text');
  expect(migrateLegacyHash()).toBe('/test/some-play/text?foo=bar');
});

test.each(['network', 'relations', 'speech', 'text', 'downloads', 'tools'])(
  'rewrites the %s tab',
  (tab) => {
    at(`/test/some-play#${tab}`);
    expect(migrateLegacyHash()).toBe(`/test/some-play/${tab}`);
  }
);

test('ignores a hash that is not a known tab', () => {
  at('/test/some-play#section-3');
  expect(migrateLegacyHash()).toBeNull();
});

test('ignores a URL without a hash', () => {
  at('/test/some-play');
  expect(migrateLegacyHash()).toBeNull();
});

test('ignores doc pages, whose hashes are real in-page anchors', () => {
  at('/doc/odd#text');
  expect(migrateLegacyHash()).toBeNull();
});

test('ignores the sparql page', () => {
  at('/sparql#text');
  expect(migrateLegacyHash()).toBeNull();
});

test.each(['/test#network', '/test/some-play/text#network'])(
  'ignores %s — not the two-segment play shape',
  (url) => {
    at(url);
    expect(migrateLegacyHash()).toBeNull();
  }
);
