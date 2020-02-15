import { useEffect } from 'react';

import { usePanZoom } from '../context';

const useWatchElements = () => {
  const {
    elementsChangesRef,
    elementsInterval,
    onElementsChange,
  } = usePanZoom();

  useEffect(() => {
    if (!onElementsChange) return undefined;

    const timer = setInterval(() => {
      const noChanges = !Object.values(elementsChangesRef.current).length;
      if (noChanges) return;

      onElementsChange(elementsChangesRef.current);
      elementsChangesRef.current = {};
    }, elementsInterval);

    return () => clearInterval(timer);
  }, [elementsInterval, onElementsChange]);
};

export default useWatchElements;
