import { useLayoutEffect, useRef } from 'react';

import { Position } from 'types';
import { usePanZoom } from 'context';
import { useElements } from 'ElementsProvider';
import produceElementPosition from 'helpers/produceElementPosition';
import { MoveRef } from '../context/SelectContext';
import { useSelect } from '../context';
import collectElements from '../helpers/collectElements';
import copyElementsPositions from '../helpers/copyElementsPositions';

const useGrabElements = (): MoveRef => {
  const { boundary } = useSelect();
  const { childRef, onElementsChange, zoomRef } = usePanZoom();
  const { elementsRef } = useElements();
  const onMoveRef: MoveRef = useRef();

  useLayoutEffect(() => {
    if (!boundary) return undefined;
    const elements = collectElements(boundary, elementsRef.current);
    const positions = copyElementsPositions(elements);
    let fromPosition: Position | null = null;

    onMoveRef.current = (nextPosition: Position) => {
      if (!fromPosition) fromPosition = nextPosition;

      const elementsNextPositions: Record<string, Position> = {};
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
