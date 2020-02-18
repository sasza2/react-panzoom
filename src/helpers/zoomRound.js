const PRECISION = 100.0;

const zoomRound = (zoom) => Math.round(zoom * PRECISION) / PRECISION;

export default zoomRound;
