import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

import { onMouseDown, onMouseUp, onMouseMove } from '../helpers/eventListener';
import { usePanZoom } from '../context';
import positionFromEvent from '../helpers/positionFromEvent';

import './Element.css';

const Element = ({
  children, id, x, y,
}) => {
  if (!id) throw new Error("Id can't be undefined");

  const [moving, setMoving] = useState(null);
  const elementRef = useRef();
  const {
    childRef,
    elementsInterval,
    elementsRef,
    elementsChangesRef,
    positionRef,
    zoomRef,
  } = usePanZoom();

  const moveRef = useRef(throttle((position) => {
    elementsChangesRef.current = {
      ...elementsChangesRef.current,
      [id]: position,
    };
  }, elementsInterval));

  useLayoutEffect(() => {
    elementsRef.current[id] = {
      node: elementRef,
    };
    return moveRef.current.clear;
  }, [id]);

  useLayoutEffect(() => {
    elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [x, y]);

  useEffect(() => {
    if (!moving) return undefined;

    const mousemove = (e) => {
      const eventPosition = positionFromEvent(e);
      const translate = {
        x: (eventPosition.clientX - positionRef.current.x) / zoomRef.current - moving.x,
        y: (eventPosition.clientY - positionRef.current.y) / zoomRef.current - moving.y,
      };

      elementsRef.current[id].position = translate;

      elementRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
      moveRef.current(translate);
    };

    const mouseup = () => setMoving(null);

    const mouseMoveClear = onMouseMove(mousemove);
    const mouseUpClear = onMouseUp(mouseup);

    return () => {
      mouseMoveClear();
      mouseUpClear();
    };
  }, [id, moving]);

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
  };

  useLayoutEffect(() => {
    const mouseDownClear = onMouseDown(elementRef.current, mousedown);
    return mouseDownClear;
  }, []);

  return (
    <div ref={elementRef} className="react-panzoom-element">
      {children}
    </div>
  );
};

Element.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
};

Element.defaultProps = {
  x: 0,
  y: 0,
};

export default Element;
