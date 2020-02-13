import { useEffect } from 'react';

import { usePanZoom } from '../context';

const EMPTY_MAP = {};

const useWatchElements = () => {
  const { elementsChangesRef, onElementsChange } = usePanZoom();

  useEffect(() => {
    if (!onElementsChange) return undefined;

    const timer = setInterval(() => {
      if (elementsChangesRef.current === EMPTY_MAP) return;

      onElementsChange(elementsChangesRef.current);
      elementsChangesRef.current = EMPTY_MAP;
    }, 150); // todo

    return () => clearInterval(timer);
  }, [onElementsChange]);
};

export default useWatchElements;
