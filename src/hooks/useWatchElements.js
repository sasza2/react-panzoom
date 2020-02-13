import { useEffect } from 'react';

import { usePanZoom } from '../context';

const EMPTY_MAP = {};

const useWatchElements = () => {
  const {
    elementsChangesRef,
    elementsInterval,
    onElementsChange,
  } = usePanZoom();

  useEffect(() => {
    if (!onElementsChange) return undefined;

    const timer = setInterval(() => {
      if (elementsChangesRef.current === EMPTY_MAP) return;

      onElementsChange(elementsChangesRef.current);
      elementsChangesRef.current = EMPTY_MAP;
    }, elementsInterval);

    return () => clearInterval(timer);
  }, [elementsInterval, onElementsChange]);
};

export default useWatchElements;
