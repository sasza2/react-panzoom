const PRECISION = 100.0;

const zoomRound = (zoom: number): number => Math.round(zoom * PRECISION) / PRECISION;

export default zoomRound;
