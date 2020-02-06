import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './Element.css';

const Element = ({ children, x, y }) => {
  const elementRef = useRef();

  useLayoutEffect(() => {
    elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [x, y]);

  const mousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
