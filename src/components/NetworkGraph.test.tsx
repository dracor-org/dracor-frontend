import {render} from '@testing-library/react';
import NetworkGraph from './NetworkGraph';

// Mimics graphology's FA2LayoutSupervisor, including the two details that
// caused the bug: `start()` throws once killed, and `kill()` is terminal.
const supervisor = {
  killed: false,
  running: false,
  starts: 0,
  start() {
    if (this.killed) {
      throw new Error(
        'graphology-layout-forceatlas2/worker.start: layout was killed.'
      );
    }
    this.starts += 1;
    this.running = true;
  },
  stop() {
    this.running = false;
  },
  kill() {
    this.killed = true;
    this.running = false;
  },
};

// Sigma's WebGL node programs touch `WebGL2RenderingContext` at import time,
// which jsdom doesn't define.
vi.mock('@sigma/node-square', () => ({NodeSquareProgram: class {}}));

vi.mock('@react-sigma/core', () => ({
  SigmaContainer: ({children}: {children: React.ReactNode}) => (
    <div data-testid="sigma">{children}</div>
  ),
  useLoadGraph: () => () => {},
}));

// `useWorkerLayoutFactory` hands back callbacks bound to the same supervisor
// instance for the lifetime of the component — `kill()` does not clear it.
vi.mock('@react-sigma/layout-forceatlas2', () => ({
  useWorkerLayoutForceAtlas2: () => ({
    start: () => supervisor.start(),
    stop: () => supervisor.stop(),
    kill: () => supervisor.kill(),
  }),
}));

const graph = (ids: string[]) => ({
  nodes: ids.map((id) => ({id, label: id})),
  edges: [],
});

beforeEach(() => {
  supervisor.killed = false;
  supervisor.running = false;
  supervisor.starts = 0;
  vi.useFakeTimers({shouldAdvanceTime: true});
});

afterEach(() => vi.useRealTimers());

test('stops the layout once it has settled', () => {
  render(
    <NetworkGraph graph={graph(['a', 'b'])} nodeColor="#000" edgeColor="#000" />
  );
  expect(supervisor.running).toBe(true);

  vi.advanceTimersByTime(2000);
  expect(supervisor.running).toBe(false);
  // Stopping must stay reversible — killing is what broke re-entry.
  expect(supervisor.killed).toBe(false);
});

test('can restart after the layout has settled', () => {
  // Re-entering the route (back button) re-runs the effect with fresh node
  // and edge identities. Against a killed supervisor this threw
  // "layout was killed" and took the whole page to the error boundary.
  const {rerender} = render(
    <NetworkGraph graph={graph(['a', 'b'])} nodeColor="#000" edgeColor="#000" />
  );
  vi.advanceTimersByTime(2000);

  expect(() =>
    rerender(
      <NetworkGraph
        graph={graph(['a', 'b', 'c'])}
        nodeColor="#000"
        edgeColor="#000"
      />
    )
  ).not.toThrow();

  expect(supervisor.starts).toBe(2);
  expect(supervisor.running).toBe(true);
});

test('never kills the layout itself', () => {
  const {unmount} = render(
    <NetworkGraph graph={graph(['a'])} nodeColor="#000" edgeColor="#000" />
  );
  vi.advanceTimersByTime(2000);
  unmount();
  // The hook owns the kill; doing it here is what left a dead supervisor
  // behind for the next render.
  expect(supervisor.killed).toBe(false);
});
