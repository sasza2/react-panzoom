import { useEffect } from 'react';

import { usePanZoom } from '../context';

const EMPTY_MAP = {};

const useWatchElements = () => {
  const { elementsMapRef, onElementsChange } = usePanZoom();

  useEffect(() => {
    if (!onElementsChange) return undefined;

    let prevRef = null;
    const timer = setInterval(() => {
      if (prevRef === elementsMapRef.current) return;

      onElementsChange(elementsMapRef.current);

      prevRef = elementsMapRef.current;
      elementsMapRef.current = EMPTY_MAP;
    }, 150); // todo

    return () => clearInterval(timer);
  }, [onElementsChange]);
};

export default useWatchElements;
