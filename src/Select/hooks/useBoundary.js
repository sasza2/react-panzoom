import {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';

import useContainerMouseDownPosition from '../../hooks/useContainerMouseDownPosition';
import { usePanZoom } from '../../context';
import { useSelect } from '../context';

const useBoundary = () => {
  const [expanding, setExpanding] = useState(null);
  const [boundary, setBoundary] = useState(null);
  const { selectRef, expandingRef } = useSelect();
  const boundaryRef = useRef();
  const { childRef, zoomRef } = usePanZoom();
  const containerMouseDownPosition = useContainerMouseDownPosition();

  const containerSize = useMemo(() => {
    if (!expanding) return null;
    return childRef.current.getBoundingClientRect();
  }, [expanding]);

  const mouseEvent = (e, positionStart) => {
    const position = containerMouseDownPosition(e);

    if (position.x < 0) position.x = 0;
    else if (position.x > containerSize.width) position.x = containerSize.width;

    if (position.y < 0) position.y = 0;
    else if (position.y > containerSize.height) position.y = containerSize.height;

    const boundaryCurrent = {
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

    expandingRef.current.style.transform = `translate(${boundaryCurrent.left}px, ${boundaryCurrent.top}px)`;
    expandingRef.current.style.width = `${boundaryCurrent.width}px`;
    expandingRef.current.style.height = `${boundaryCurrent.height}px`;

    boundaryRef.current = boundaryCurrent;
  };

  useLayoutEffect(() => {
    if (expanding || boundary) return undefined;

    const mousedown = (e) => {
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
    if (!expanding || boundary || !containerSize) return undefined;

    const mouseup = (e) => {
      mouseEvent(e, expanding);
      setExpanding(null);
      setBoundary(boundaryRef.current);
    };

    const mousemove = (e) => mouseEvent(e, expanding);

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    return () => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    };
  }, [boundary, containerSize, expanding]);

  return { expanding, boundary };
};

export default useBoundary;
