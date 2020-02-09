import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import { usePanZoom } from '../context';
import positionFromEvent from '../helpers/positionFromEvent';

import './Element.css';

const Element = ({ children, x, y }) => {
  const [moving, setMoving] = useState(null);
  const elementRef = useRef();

  const { childRef, positionRef, zoomRef } = usePanZoom();

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
    };

    const mouseup = () => setMoving(null);

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    return () => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    };
  }, [moving]);

  const mousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const eventPosition = positionFromEvent(e);
    const parent = childRef.current.getBoundingClientRect();
    const rect = elementRef.current.getBoundingClientRect();

    setMoving({
      x: (eventPosition.clientX - rect.left + parent.width) / zoomRef.current,
      y: (eventPosition.clientY - rect.top + parent.height) / zoomRef.current,
    });
  };

  useLayoutEffect(() => {
    elementRef.current.addEventListener('mousedown', mousedown);
    return () => {
      elementRef.current.removeEventListener('mousedown', mousedown);
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
  x: PropTypes.number,
  y: PropTypes.number,
};

Element.defaultProps = {
  x: 0,
  y: 0,
};

export default Element;
