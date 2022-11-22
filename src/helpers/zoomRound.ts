import { ZOOM_PRECISION } from 'consts'

const zoomRound = (zoom: number): number => Math.round(zoom * ZOOM_PRECISION) / ZOOM_PRECISION;

export default zoomRound;
