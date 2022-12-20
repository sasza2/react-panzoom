import { MutableRefObject } from 'react';

import { Position, Zoom } from 'types';
import produceStyle from '@/helpers/produceStyle';

type Reset = (
  props: {
    childRef: MutableRefObject<HTMLDivElement>,
    positionRef: MutableRefObject<Position>,
    zoomRef: Zoom,
  }
) => () => void

const reset: Reset = ({ childRef, positionRef, zoomRef }) => () => {
  const ref = childRef;
  const zoom = zoomRef;
  const position = positionRef;
  zoom.current = 1;
  position.current = { x: 0, y: 0 };
  ref.current.style.transform = produceStyle({
    position: positionRef.current,
    zoom: zoomRef.current,
  });
};

export default reset;
