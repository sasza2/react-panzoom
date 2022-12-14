import { MutableRefObject } from 'react';

import { Position, Zoom } from 'types';
import produceStyle from 'helpers/produceStyle';
import zoomRound from 'helpers/zoomRound';

type GetZoom = (props: { zoomRef: Zoom }) => () => number

export const getZoom: GetZoom = ({ zoomRef }) => () => zoomRef.current;

type SetZoom = (
  props: {
    childRef: MutableRefObject<HTMLDivElement>,
    positionRef: MutableRefObject<Position>,
    zoomRef: Zoom,
  }
) => (value: number) => void

export const setZoom: SetZoom = ({ childRef, positionRef, zoomRef }) => (value) => {
  const ref = childRef;
  const zoom = zoomRef;
  zoom.current = zoomRound(value);
  ref.current.style.transform = produceStyle({
    position: positionRef.current,
    zoom: zoomRef.current,
  });
};

type ZoomIn = SetZoom

export const zoomIn: ZoomIn = ({ childRef, positionRef, zoomRef }) => (value) => {
  setZoom({ childRef, positionRef, zoomRef })(getZoom({ zoomRef })() + value);
};

type ZoomOut = SetZoom

export const zoomOut: ZoomOut = ({ childRef, positionRef, zoomRef }) => (value) => {
  setZoom({ childRef, positionRef, zoomRef })(getZoom({ zoomRef })() - value);
};
