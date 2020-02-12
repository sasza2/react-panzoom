import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

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
    elementsMapRef,
    positionRef,
    zoomRef,
  } = usePanZoom();
  const moveRef = useRef(throttle((position) => {
    elementsMapRef.current = {
      ...elementsMapRef.current,
      [id]: position,
    };
  }, 500)); // todo

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

      elementRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
      moveRef.current(translate);
    };

    const mouseup = () => setMoving(null);

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('touchmove', mousemove);
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('touchend', mouseup);

    return () => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('touchmove', mousemove);
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('touchend', mouseup);
    };
  }, [moving]);

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
    elementRef.current.addEventListener('mousedown', mousedown);
    elementRef.current.addEventListener('touchstart', mousedown);
    return () => {
      elementRef.current.removeEventListener('mousedown', mousedown);
      elementRef.current.removeEventListener('touchstart', mousedown);
    };
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
