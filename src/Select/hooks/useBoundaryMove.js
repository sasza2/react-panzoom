import { useLayoutEffect, useState } from 'react';

import { onMouseUp, onMouseMove } from '../../helpers/eventListener';
import { useElementMouseDownPosition, useElementMouseMovePosition } from '../../hooks/useElementEventPosition';
import { useSelect } from '../context';

const useBoundaryMove = ({ boundary }) => {
  const { movingRef, selectRef } = useSelect();
  const mouseDownPosition = useElementMouseDownPosition();
  const mouseMovePosition = useElementMouseMovePosition();
  const [move, setMove] = useState(null);

  useLayoutEffect(() => {
    if (!boundary) return undefined;

    const mousedownOnSelectArea = (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log('stop'); // eslint-disable-line
    };

    const mousedownOnMovingArea = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const position = mouseDownPosition(e, selectRef);

      setMove({
        x: position.x - boundary.left,
        y: position.y - boundary.top,
      });
    };

    selectRef.current.addEventListener('mousedown', mousedownOnSelectArea);
    movingRef.current.addEventListener('mousedown', mousedownOnMovingArea);

    return () => {
      selectRef.current.removeEventListener('mousedown', mousedownOnSelectArea);
      movingRef.current.removeEventListener('mousedown', mousedownOnMovingArea);
    };
  }, [boundary]);

  useLayoutEffect(() => {
    if (!move) return undefined;

    const mousemove = (e) => {
      const position = mouseMovePosition(e, move, movingRef);
      movingRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    };

    const mouseup = () => setMove(null);

    const mouseMoveClear = onMouseMove(mousemove);
    const mouseUpClear = onMouseUp(mouseup);

    return () => {
      mouseMoveClear();
      mouseUpClear();
    };
  }, [boundary, move]);
};

export default useBoundaryMove;
