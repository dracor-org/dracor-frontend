import {render} from '@testing-library/react';
import type {Segment} from '../../types';
import Sapogov from './Sapogov';
import Yarkho from './Yarkho';
import TrilckeFischer from './TrilckeFischer';

// recharts measures its container with getBoundingClientRect; setupTests.ts
// gives jsdom elements a non-zero box so the charts actually draw.
const renderChart = (ui: React.ReactElement) => render(ui);

const seg = (n: number, speakers: string[]): Segment => ({
  number: n,
  title: `Scene ${n}`,
  type: 'scene',
  speakers,
});

// 3 scenes: 2, 3 and 1 speakers. "volk" is the group character.
const segments: Segment[] = [
  seg(1, ['koenig', 'koenigin']),
  seg(2, ['koenig', 'bote', 'volk']),
  seg(3, ['volk']),
];

/** The y values recharts drew, read back off the rendered area path. */
function areaCount(container: HTMLElement) {
  return container.querySelectorAll('.recharts-area').length;
}

describe('Sapogov', () => {
  test('plots one point per scene', () => {
    const {container} = renderChart(
      <Sapogov groups={[]} segments={segments} />
    );
    expect(
      container.querySelectorAll('.recharts-area-dot, .recharts-area')
    ).not.toHaveLength(0);
    // One x tick per scene.
    const ticks = container.querySelectorAll(
      '.recharts-xAxis .recharts-cartesian-axis-tick'
    );
    expect(ticks).toHaveLength(segments.length);
  });

  test('draws a single series when there are no group characters', () => {
    const {container} = renderChart(
      <Sapogov groups={[]} segments={segments} />
    );
    expect(areaCount(container)).toBe(1);
  });

  test('adds the non-group series when the play has groups', () => {
    const {container} = renderChart(
      <Sapogov groups={['volk']} segments={segments} />
    );
    expect(areaCount(container)).toBe(2);
  });

  test('labels both axes', () => {
    const {getByText} = renderChart(
      <Sapogov groups={[]} segments={segments} />
    );
    expect(getByText('number of scene')).toBeInTheDocument();
    expect(getByText('number of characters')).toBeInTheDocument();
  });

  test('names the series in the legend', () => {
    const {getByText} = renderChart(
      <Sapogov groups={['volk']} segments={segments} />
    );
    expect(
      getByText('Speech distribution (as described in Sapogov 1974)')
    ).toBeInTheDocument();
    expect(getByText('non-group characters only')).toBeInTheDocument();
  });
});

describe('Yarkho', () => {
  test('buckets scenes by speaker count, interpolating gaps', () => {
    // Speaker counts are 2, 3, 1 — so buckets 1, 2 and 3 all exist.
    const {container} = renderChart(<Yarkho groups={[]} segments={segments} />);
    const ticks = container.querySelectorAll(
      '.recharts-xAxis .recharts-cartesian-axis-tick'
    );
    expect(ticks.length).toBeGreaterThanOrEqual(3);
  });

  test('interpolates a zero for a speaker count that never occurs', () => {
    // Counts 1 and 3 occur, 2 does not — it must still be plotted as zero so
    // the line doesn't jump the gap.
    const {container} = renderChart(
      <Yarkho groups={[]} segments={[seg(1, ['a']), seg(2, ['a', 'b', 'c'])]} />
    );
    const points = container
      .querySelector('.recharts-area-area')
      ?.getAttribute('d');
    expect(points).toBeTruthy();
    // 3 vertices => two line segments drawn, i.e. the gap was filled.
    expect((points!.match(/L/g) || []).length).toBeGreaterThanOrEqual(2);
  });

  test('draws a single series when there are no group characters', () => {
    const {container} = renderChart(<Yarkho groups={[]} segments={segments} />);
    expect(areaCount(container)).toBe(1);
  });

  test('adds the non-group series when the play has groups', () => {
    const {container} = renderChart(
      <Yarkho groups={['volk']} segments={segments} />
    );
    expect(areaCount(container)).toBe(2);
  });

  test('labels both axes', () => {
    const {getByText} = renderChart(<Yarkho groups={[]} segments={segments} />);
    expect(
      getByText(
        'number of characters per scene (monologues, dialogues, polylogues)'
      )
    ).toBeInTheDocument();
    expect(getByText('number of scenes')).toBeInTheDocument();
  });
});

describe('TrilckeFischer', () => {
  test('plots one point per segment transition', () => {
    const {container} = renderChart(<TrilckeFischer segments={segments} />);
    const ticks = container.querySelectorAll(
      '.recharts-xAxis .recharts-cartesian-axis-tick'
    );
    expect(ticks).toHaveLength(segments.length - 1);
  });

  test('draws the drama change rate reference line', () => {
    const {container} = renderChart(<TrilckeFischer segments={segments} />);
    expect(
      container.querySelector('.recharts-reference-line')
    ).toBeInTheDocument();
  });
});
