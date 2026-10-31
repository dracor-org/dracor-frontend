import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderRoute} from '../../testUtils';

test('renders the corpus title and its plays', async () => {
  await renderRoute('/test');
  expect(await screen.findByText(/Test Drama Corpus/)).toBeInTheDocument();
  expect(screen.getByText('Mustertragödie')).toBeInTheDocument();
  expect(screen.getByText('Lustspiel')).toBeInTheDocument();
});

test('links a play row to its play route', async () => {
  await renderRoute('/test');
  const link = await screen.findByRole('link', {name: 'Mustertragödie'});
  expect(link).toHaveAttribute('href', '/test/mustermann-mustertragoedie');
});

test('shows the author, falling back to Anonymous', async () => {
  await renderRoute('/test');
  expect(await screen.findByText('Mustermann, Maria')).toBeInTheDocument();
  expect(screen.getByText('Anonymous')).toBeInTheDocument();
});

test('filters the play table', async () => {
  await renderRoute('/test');
  await screen.findByText('Mustertragödie');

  const search = screen.getByRole('textbox');
  await userEvent.type(search, 'Lustspiel');

  // The search box is debounced, so wait for the filtered-out row to go.
  await waitFor(() =>
    expect(screen.queryByText('Mustertragödie')).not.toBeInTheDocument()
  );
  expect(screen.getByText('Lustspiel')).toBeInTheDocument();
});

test('renders a not-found message for an unknown corpus', async () => {
  await renderRoute('/nosuchcorpus');
  expect(await screen.findByText(/No such corpus/)).toBeInTheDocument();
});
