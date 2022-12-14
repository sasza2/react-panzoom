import { useEffect } from 'react';

import { ELEMENT_AUTO_MOVE_SPEED, ELEMENT_AUTO_MOVE_STEP } from 'consts';
import { usePanZoom } from 'context';
import { useElements } from 'ElementsProvider';
import appendToCurrentPosition from 'helpers/appendToCurrentPosition';
import isCursorOnEdge from 'helpers/isCursorOnEdge';
import isEdgeVisible from 'helpers/isEdgeVisible';
import produceElementPosition from 'helpers/produceElementPosition';
import updateFamilyOfElementsPosition from 'helpers/updateFamilyOfElementsPosition';

type UseElementAutoMoveAtEdge = () => void

const useElementAutoMoveAtEdge: UseElementAutoMoveAtEdge = () => {
  const {
    childRef,
    disabledElements,
    onElementsChangeRef,
    positionRef,
    zoomRef,
  } = usePanZoom();

  const {
    elementsRef,
    elementsInMove,
    lastElementMouseMoveEventRef,
  } = useElements();

  useEffect(() => {
    if (disabledElements || !elementsInMove) return undefined;

    const timer = setInterval(() => {
      if (!lastElementMouseMoveEventRef.current) return;

      const addPosition = {
        x: 0,
        y: 0,
      };

      const cursorOnEdge = isCursorOnEdge(childRef, lastElementMouseMoveEventRef.current);
      if (cursorOnEdge.left && !isEdgeVisible.left(childRef, positionRef)) {
        addPosition.x = ELEMENT_AUTO_MOVE_STEP;
      } else if (cursorOnEdge.right && !isEdgeVisible.right(childRef, positionRef)) {
        addPosition.x = -ELEMENT_AUTO_MOVE_STEP;
      }

      if (cursorOnEdge.top && !isEdgeVisible.top(childRef, positionRef)) {
        addPosition.y = ELEMENT_AUTO_MOVE_STEP;
      } else if (cursorOnEdge.bottom && !isEdgeVisible.bottom(childRef, positionRef)) {
        addPosition.y = -ELEMENT_AUTO_MOVE_STEP;
      }

      appendToCurrentPosition({
        childRef,
        positionRef,
        addPosition,
        zoomRef,
      });

      updateFamilyOfElementsPosition({
        elementsRef,
        elementsInMove,
        produceNextPosition: (from, currentElement) => produceElementPosition({
          element: currentElement.node.current,
          container: childRef.current,
          x: currentElement.position.x - addPosition.x / zoomRef.current,
          y: currentElement.position.y - addPosition.y / zoomRef.current,
          zoom: zoomRef.current,
        }),
        onElementsChange: onElementsChangeRef.current,
      });
    }, ELEMENT_AUTO_MOVE_SPEED);

    return () => {
      clearInterval(timer);
      lastElementMouseMoveEventRef.current = null;
    };
  }, [disabledElements, elementsInMove]);
};

export default useElementAutoMoveAtEdge;
