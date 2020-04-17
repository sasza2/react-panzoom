import { useLayoutEffect, useRef } from 'react';

import produceElementPosition from '../../helpers/produceElementPosition';
import { usePanZoom } from '../../context';
import { useSelect } from '../context';

const collectElements = (boundary, elements) => {
  const elementsInBoundary = {};

  Object.entries(elements).forEach(([id, element]) => {
    if (element.position.x >= boundary.left
      && element.position.x <= boundary.right
      && element.position.y >= boundary.top
      && element.position.y <= boundary.bottom
    ) {
      elementsInBoundary[id] = element;
    }
  });

  return elementsInBoundary;
};

const copyElementsPositions = (elements) => {
  const positions = {};
  Object.entries(elements).forEach(([id, element]) => {
    positions[id] = { ...element.position };
  });
  return positions;
};

const useGrabElements = () => {
  const { boundary } = useSelect();
  const { childRef, elementsRef, zoomRef } = usePanZoom();
  const onMoveRef = useRef();

  useLayoutEffect(() => {
    if (!boundary) return undefined;
    const elements = collectElements(boundary, elementsRef.current);
    const positions = copyElementsPositions(elements);
    let fromPosition = null;

    onMoveRef.current = (nextPosition) => {
      if (!fromPosition) fromPosition = nextPosition;
      Object.entries(elements).forEach(([id, element]) => {
        const position = positions[id];
        const { node } = element;

        const translate = produceElementPosition({
          element: element.node.current,
          container: childRef.current,
          x: position.x + (nextPosition.x - fromPosition.x),
          y: position.y + (nextPosition.y - fromPosition.y),
          zoom: zoomRef.current,
        });

        elementsRef.current[element.id].position = translate;
        node.current.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
      });
    };

    return () => {
      onMoveRef.current = null;
    };
  }, [boundary]);

  return onMoveRef;
};

export default useGrabElements;
