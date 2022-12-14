import { MutableRefObject } from 'react';

import { Position, Zoom } from 'types';
import positionClone from 'helpers/positionClone';
import produceStyle from 'helpers/produceStyle';

type GetPosition = (
  props: { positionRef: MutableRefObject<Position> }
) => () => Position

export const getPosition: GetPosition = ({ positionRef }) => () => positionClone(positionRef);

type SetPosition = (
  props: {
    childRef: MutableRefObject<HTMLDivElement>,
    positionRef: MutableRefObject<Position>,
    zoomRef: Zoom,
  }
) => (x: number, y: number) => void

export const setPosition: SetPosition = ({
  childRef,
  positionRef,
  zoomRef,
}) => (x, y) => {
  const ref = childRef;
  const position = positionRef;
  position.current = { x, y };
  ref.current.style.transform = produceStyle({
    position: positionRef.current,
    zoom: zoomRef.current,
  });
};
