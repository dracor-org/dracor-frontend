import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderRoute} from '../../../testUtils';

// Sigma needs a WebGL context, which jsdom has no implementation for. The
// graphs are lazy-loaded in Play.tsx, so stubbing the modules keeps the rest
// of the play page under test.
vi.mock('../../../components/NetworkGraph', () => ({
  default: () => <div data-testid="network-graph" />,
}));
vi.mock('../../../components/RelationsGraph', () => ({
  default: () => <div data-testid="relations-graph" />,
}));

const PLAY = '/test/mustermann-mustertragoedie';

test('renders the play header on every tab', async () => {
  await renderRoute(`${PLAY}/downloads`);
  // The header block is rendered once per responsive breakpoint, so both the
  // title and the author appear more than once.
  const headings = await screen.findAllByRole('heading', {
    name: 'Mustertragödie',
  });
  expect(headings.length).toBeGreaterThan(0);
  // PlayDetailsHeader passes the author's `fullname` to AuthorInfo.
  expect(screen.getAllByText('Maria Mustermann').length).toBeGreaterThan(0);
});

test('the bare play URL redirects to the network tab', async () => {
  const {router} = await renderRoute(PLAY);
  expect(router.state.location.pathname).toBe(`${PLAY}/network`);
});

test('an unknown tab redirects to the network tab', async () => {
  const {router} = await renderRoute(`${PLAY}/nonsense`);
  expect(router.state.location.pathname).toBe(`${PLAY}/network`);
});

test('the network tab shows the graph, the cast list and the metrics', async () => {
  await renderRoute(`${PLAY}/network`);
  expect(await screen.findByTestId('network-graph')).toBeInTheDocument();
  expect(screen.getByText(/character network/)).toBeInTheDocument();
  expect(screen.getByRole('link', {name: 'our FAQs'})).toHaveAttribute(
    'href',
    '/doc/faq'
  );
  expect(screen.getByText('König')).toBeInTheDocument();
});

test('the FAQ link in the network description routes client-side', async () => {
  // A plain <a href> here would reload the whole app.
  const {router} = await renderRoute(`${PLAY}/network`);
  await userEvent.click(await screen.findByRole('link', {name: 'our FAQs'}));
  await waitFor(() => expect(router.state.location.pathname).toBe('/doc/faq'));
});

test('the relations tab shows the relations graph', async () => {
  await renderRoute(`${PLAY}/relations`);
  expect(await screen.findByTestId('relations-graph')).toBeInTheDocument();
  expect(
    screen.getByText(/kinship and other relationship data/)
  ).toBeInTheDocument();
});

test('the downloads tab lists download options', async () => {
  await renderRoute(`${PLAY}/downloads`);
  expect(
    await screen.findByText(/provides download options/)
  ).toBeInTheDocument();
});

test('the tools tab links to third-party tools', async () => {
  await renderRoute(`${PLAY}/tools`);
  expect(
    await screen.findByText(/links to third-party tools/)
  ).toBeInTheDocument();
});

test('the speech tab marks itself active', async () => {
  await renderRoute(`${PLAY}/speech`);
  const tab = await screen.findByRole('link', {name: 'Speech distribution'});
  expect(tab).toHaveAttribute('data-status', 'active');
});

test('the text tab shows the TEI frame, the source info and the segments', async () => {
  await renderRoute(`${PLAY}/text`);
  await screen.findAllByRole('heading', {name: 'Mustertragödie'});

  await waitFor(() =>
    expect(document.querySelector('.tei-frame')).not.toBeNull()
  );
  expect(screen.getByRole('link', {name: 'TextGrid'})).toHaveAttribute(
    'href',
    'https://textgrid.invalid/test000001'
  );
  expect(screen.getByText('Act 1, Scene 1')).toBeInTheDocument();
  expect(screen.getByText('König, Königin')).toBeInTheDocument();
});

test('the tab bar links to each tab as a path segment', async () => {
  await renderRoute(`${PLAY}/network`);
  const relations = await screen.findByRole('link', {name: 'Relations'});
  expect(relations).toHaveAttribute('href', `${PLAY}/relations`);
});

test('renders a not-found message for an unknown play', async () => {
  await renderRoute('/test/nosuchplay/network');
  expect(await screen.findByText('No such play!')).toBeInTheDocument();
});
