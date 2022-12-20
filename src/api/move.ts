import { MutableRefObject } from 'react';

import { Position, Zoom } from 'types';
import positionClone from '@/helpers/positionClone';
import produceStyle from '@/helpers/produceStyle';

type Move = (
  props: {
    childRef: MutableRefObject<HTMLDivElement>,
    positionRef: MutableRefObject<Position>,
    zoomRef: Zoom,
  }
) => (x: number, y: number) => Position

const move: Move = ({
  childRef, positionRef, zoomRef,
}) => (x, y) => {
  const ref = childRef;
  const position = positionRef;

  if (position.current) {
    position.current = {
      x: positionRef.current.x + x,
      y: positionRef.current.y + y,
    };
  } else {
    position.current = { x, y };
  }

  ref.current.style.transform = produceStyle({
    position: positionRef.current,
    zoom: zoomRef.current,
  });

  return positionClone(positionRef);
};

export default move;
