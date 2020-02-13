import { useEffect } from 'react';

import { usePanZoom } from '../context';

const EMPTY_MAP = {};

const useWatchElements = () => {
  const { elementsMapRef, onElementsChange } = usePanZoom();

  useEffect(() => {
    if (!onElementsChange) return undefined;

    const timer = setInterval(() => {
      if (elementsMapRef.current === EMPTY_MAP) return;

      onElementsChange(elementsMapRef.current);
      elementsMapRef.current = EMPTY_MAP;
    }, 150); // todo

    return () => clearInterval(timer);
  }, [onElementsChange]);
};

export default useWatchElements;
