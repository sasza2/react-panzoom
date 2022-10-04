import {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';

import { Position } from 'types'
import { usePanZoom } from 'context';
import { onMouseUp, onMouseMove } from 'helpers/eventListener';
import useContainerMouseDownPosition from 'hooks/useContainerMouseDownPosition';
import { Boundary } from '../context/SelectContext'
import { useSelect } from '../context';

type UseBoundary = () => {
  expanding: Position | null,
  boundary: Boundary,
}

const useBoundary: UseBoundary = () => {
  const [expanding, setExpanding] = useState<Position | null>(null);
  const {
    boundary, setBoundary, selectRef, expandingRef,
  } = useSelect();
  const boundaryRef = useRef<Boundary>();
  const { childRef, zoomRef } = usePanZoom();
  const containerMouseDownPosition = useContainerMouseDownPosition();

  const mouseEvent = (e: MouseEvent, positionStart: Position) => {
    const containerSize = childRef.current.getBoundingClientRect();
    const position = containerMouseDownPosition(e);

    if (position.x < 0) position.x = 0;
    else if (position.x > containerSize.width) position.x = containerSize.width;

    if (position.y < 0) position.y = 0;
    else if (position.y > containerSize.height) position.y = containerSize.height;

    const boundaryCurrent: Partial<Boundary> = {
      width: (position.x - positionStart.x) / zoomRef.current,
      height: (position.y - positionStart.y) / zoomRef.current,
      left: positionStart.x / zoomRef.current,
      top: positionStart.y / zoomRef.current,
    };

    if (boundaryCurrent.width < 0) {
      boundaryCurrent.width = -boundaryCurrent.width;
      boundaryCurrent.left -= boundaryCurrent.width;
    }

    if (boundaryCurrent.height < 0) {
      boundaryCurrent.height = -boundaryCurrent.height;
      boundaryCurrent.top -= boundaryCurrent.height;
    }

    boundaryCurrent.right = boundaryCurrent.left + boundaryCurrent.width;
    boundaryCurrent.bottom = boundaryCurrent.top + boundaryCurrent.height;

    expandingRef.current.style.transform = `translate(${boundaryCurrent.left}px, ${boundaryCurrent.top}px)`;
    expandingRef.current.style.width = `${boundaryCurrent.width}px`;
    expandingRef.current.style.height = `${boundaryCurrent.height}px`;

    boundaryRef.current = boundaryCurrent as Boundary;
  };

  useLayoutEffect(() => {
    if (expanding || boundary) return undefined;

    const mousedown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const position = containerMouseDownPosition(e);
      setExpanding(position);
      mouseEvent(e, position);
    };

    selectRef.current.addEventListener('mousedown', mousedown);

    return () => {
      selectRef.current.removeEventListener('mousedown', mousedown);
    };
  }, [boundary, expanding]);

  useEffect(() => {
    if (!expanding || boundary) return undefined;

    const mouseup = (e: MouseEvent) => {
      mouseEvent(e, expanding);
      setExpanding(null);
      setBoundary(boundaryRef.current);
    };

    const mousemove = (e: MouseEvent) => mouseEvent(e, expanding);

    const mouseMoveClear = onMouseMove(mousemove);
    const mouseUpClear = onMouseUp(window, mouseup);

    return () => {
      mouseMoveClear();
      mouseUpClear();
    };
  }, [boundary, expanding]);

  return { expanding, boundary };
};

export default useBoundary;
