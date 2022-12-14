import { useLayoutEffect } from 'react';

import { onMouseDown, onMouseUp, onMouseMove } from 'helpers/eventListener';
import { useElementMouseDownPosition, useElementMouseMovePosition } from 'hooks/useElementEventPosition';
import { MoveRef } from '../context/SelectContext';
import { useSelect } from '../context';

type UseBoundaryMove = ({ grabElementsRef }: { grabElementsRef: MoveRef }) => void

const useBoundaryMove: UseBoundaryMove = ({ grabElementsRef }) => {
  const {
    boundary, setBoundary, movingRef, selectRef, move, setMove,
  } = useSelect();
  const mouseDownPosition = useElementMouseDownPosition();
  const mouseMovePosition = useElementMouseMovePosition();

  useLayoutEffect(() => {
    if (!boundary) return undefined;

    const mousedownOnSelectArea = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setBoundary(null);
    };

    const mousedownOnMovingArea = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const position = mouseDownPosition(e, selectRef);
      const nextMove = {
        x: position.x - boundary.left,
        y: position.y - boundary.top,
      };
      setMove(nextMove);
    };

    const selectMouseDownClear = onMouseDown(selectRef.current, mousedownOnSelectArea);
    const movingMouseDownClear = onMouseDown(movingRef.current, mousedownOnMovingArea);

    return () => {
      selectMouseDownClear();
      movingMouseDownClear();
    };
  }, [boundary]);

  useLayoutEffect(() => {
    if (!move) return undefined;

    const mousemove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const position = mouseMovePosition(e, move, movingRef);
      movingRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      grabElementsRef.current(position);
    };

    const mouseup = () => {
      setMove(null);
      setBoundary(null);
    };

    const mouseMoveClear = onMouseMove(mousemove);
    const mouseUpClear = onMouseUp(window, mouseup);

    return () => {
      mouseMoveClear();
      mouseUpClear();
    };
  }, [boundary, move]);
};

export default useBoundaryMove;
