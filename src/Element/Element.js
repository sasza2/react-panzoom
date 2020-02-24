import React, {
  memo, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import { onMouseDown, onMouseUp, onMouseMove } from '../helpers/eventListener';
import { usePanZoom } from '../context';
import produceElementPosition from '../helpers/produceElementPosition';
import positionFromEvent from '../helpers/positionFromEvent';

let lastZIndex = 2;

const ELEMENT_STYLE = {
  display: 'inline-block',
  position: 'absolute',
  left: 0,
  top: 0,
  'pointer-events': 'all',
};
const ELEMENT_STYLE_DISABLED = {
  'pointer-events': 'none',
};

const Element = ({
  children, disabled, id, x, y,
}) => {
  if (!id) throw new Error("Id can't be undefined");

  const [moving, setMoving] = useState(null);
  const elementRef = useRef();

  const {
    boundary,
    childRef,
    disabledElements,
    elementsRef,
    onElementsChange,
    positionRef,
    zoomRef,
  } = usePanZoom();

  useLayoutEffect(() => {
    elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
    elementsRef.current[id] = {
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
      const eventPosition = positionFromEvent(e);
      const translate = produceElementPosition({
        element: elementRef.current,
        container: childRef.current,
        x: (eventPosition.clientX - positionRef.current.x) / zoomRef.current - moving.x,
        y: (eventPosition.clientY - positionRef.current.y) / zoomRef.current - moving.y,
        zoom: zoomRef.current,
      });

      elementsRef.current[id].position = translate;
      elementRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px)`;

      if (onElementsChange) {
        onElementsChange({
          [id]: translate,
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

    const increateZIndex = () => {
      lastZIndex += 1;
      elementRef.current.style.zIndex = lastZIndex;
    };

    const mousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const eventPosition = positionFromEvent(e);
      const parent = childRef.current.parentNode.getBoundingClientRect();
      const rect = elementRef.current.getBoundingClientRect();

      setMoving({
        x: (eventPosition.clientX - rect.left + parent.left) / zoomRef.current,
        y: (eventPosition.clientY - rect.top + parent.top) / zoomRef.current,
      });

      increateZIndex();
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
  x: PropTypes.number,
  y: PropTypes.number,
};

Element.defaultProps = {
  disabled: false,
  x: 0,
  y: 0,
};

export default memo(Element);
