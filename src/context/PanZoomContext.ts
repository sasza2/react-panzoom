import { createContext, MutableRefObject } from 'react';

import { OnElementsChange, PanZoomProps, Position, Zoom } from '../types'

export type PanZoomContextProps = {
  blockMovingRef: MutableRefObject<boolean>,
  childRef: MutableRefObject<HTMLDivElement>,
  loading: boolean,
  onElementsChangeRef: MutableRefObject<OnElementsChange>,
  positionRef: MutableRefObject<Position>,
  setLoading: (loading: boolean) => void,
  zoomRef: Zoom,
  zoomSpeed: number,
} & PanZoomProps

const PanZoomContext = createContext<PanZoomContextProps>({} as PanZoomContextProps);

export default PanZoomContext;
