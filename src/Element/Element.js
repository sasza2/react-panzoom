import React, {
  memo, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import { ELEMENT_STYLE, ELEMENT_STYLE_DISABLED } from '../styles';
import { onMouseDown, onMouseUp, onMouseMove } from '../helpers/eventListener';
import { usePanZoom } from '../context';
import stopEventPropagation from '../helpers/stopEventPropagation';
import { useElementMouseDownPosition, useElementMouseMovePosition } from '../hooks/useElementEventPosition';

let lastZIndex = 2;

const Element = ({
  children, disabled, id, onClick, x, y,
}) => {
  const mouseDownPosition = useElementMouseDownPosition();
  const mouseMovePosition = useElementMouseMovePosition();

  if (!id) throw new Error("Id can't be undefined");

  const [moving, setMoving] = useState(null);
  const elementRef = useRef();

  const {
    boundary,
    disabledElements,
    elementsRef,
    onElementsChange,
  } = usePanZoom();

  useLayoutEffect(() => {
    elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
    elementsRef.current[id] = {
      id,
      node: elementRef,
      position: {
        x, y,
      },
    };

    return () => {
      delete elementsRef.current[id];
    };
  }, [id, x, y]);

  useEffect(() => {
    if (!moving || disabledElements) return undefined;

    const mousemove = (e) => {
      const position = mouseMovePosition(e, moving, elementRef);

      elementsRef.current[id].position = position;
      elementRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;

      if (onElementsChange) {
        onElementsChange({
          [id]: position,
        });
      }
    };

    const mouseup = () => setMoving(null);

    const mouseMoveClear = onMouseMove(mousemove);
    const mouseUpClear = onMouseUp(mouseup);

    return () => {
      mouseMoveClear();
      mouseUpClear();
    };
  }, [boundary, disabledElements, id, moving, onElementsChange]);

  useLayoutEffect(() => {
    if (disabled) return undefined;

    const increaseZIndex = () => {
      lastZIndex += 1;
      elementRef.current.style.zIndex = lastZIndex;
    };

    const mousedown = (e) => {
      const position = mouseDownPosition(e, elementRef);
      const stop = stopEventPropagation();

      if (onClick) {
        onClick({
          e,
          stop,
          ...position,
        });
      }

      e.preventDefault();
      e.stopPropagation();

      if (stop.done) return;

      setMoving(position);

      increaseZIndex();
    };

    const mouseDownClear = onMouseDown(elementRef.current, mousedown);
    return mouseDownClear;
  }, [disabled]);

  const className = useMemo(() => {
    const base = 'react-panzoom-element';
    const classes = [base];
    if (disabled) classes.push(`${base}--disabled`);
    classes.push(`${base}--id-${id}`);
    return classes.join(' ');
  }, [disabled, id]);

  const elementStyle = useMemo(() => {
    let style = { ...ELEMENT_STYLE };
    if (disabled) style = { ...style, ...ELEMENT_STYLE_DISABLED };
    return style;
  }, [disabled]);

  return (
    <div ref={elementRef} className={className} style={elementStyle}>
      {children}
    </div>
  );
};

Element.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
};

Element.defaultProps = {
  disabled: false,
  onClick: null,
  x: 0,
  y: 0,
};

export default memo(Element);
