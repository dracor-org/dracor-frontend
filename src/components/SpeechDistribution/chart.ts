// Shared chart styling for the speech-distribution variants, so the three
// charts stay visually consistent.

export const PRIMARY = '#aaeeff';
export const SECONDARY = '#61affe';

/** Matches the translucent `#..1a` fills the Chart.js versions used. */
const FILL_OPACITY = 0.1;

export const CHART_HEIGHT = 453;

export const AXIS_TICK = {fontSize: 10};
export const AXIS_LABEL = {fontSize: 12, fill: '#1F2448'};

export function areaProps(color: string) {
  return {
    type: 'linear' as const,
    stroke: color,
    strokeWidth: 2,
    fill: color,
    fillOpacity: FILL_OPACITY,
    dot: false,
    activeDot: {r: 5, stroke: '#1F2448', strokeWidth: 2, fill: color},
    isAnimationActive: false,
  };
}
