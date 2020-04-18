import { useLayoutEffect, useRef } from 'react';

import { usePanZoom } from 'context';
import produceElementPosition from 'helpers/produceElementPosition';
import { useSelect } from '../context';
import collectElements from '../helpers/collectElements';
import copyElementsPositions from '../helpers/copyElementsPositions';

const useGrabElements = () => {
  const { boundary } = useSelect();
  const {
    childRef, elementsRef, onElementsChange, zoomRef,
  } = usePanZoom();
  const onMoveRef = useRef();

  useLayoutEffect(() => {
    if (!boundary) return undefined;
    const elements = collectElements(boundary, elementsRef.current);
    const positions = copyElementsPositions(elements);
    let fromPosition = null;

    onMoveRef.current = (nextPosition) => {
      if (!fromPosition) fromPosition = nextPosition;

      const elementsNextPositions = {};
      Object.entries(elements).forEach(([id, element]) => {
        const positionOnStart = positions[id];
        const { node } = element;

        const position = produceElementPosition({
          element: element.node.current,
          container: childRef.current,
          x: positionOnStart.x + (nextPosition.x - fromPosition.x),
          y: positionOnStart.y + (nextPosition.y - fromPosition.y),
          zoom: zoomRef.current,
        });

        elementsRef.current[element.id].position = position;
        elementsNextPositions[id] = position;
        node.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      });

      if (onElementsChange) onElementsChange(elementsNextPositions);
    };

    return () => {
      onMoveRef.current = null;
    };
  }, [boundary]);

  return onMoveRef;
};

export default useGrabElements;
