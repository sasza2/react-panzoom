import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Element = ({ children }) => {
  const elementRef = useRef();

  const mousedown = (e) => {
    e.preventDefault();
    console.log(e); // eslint-disable-line
  };

  useLayoutEffect(() => {
    elementRef.current.addEventListener('mousedown', mousedown);
    return () => {
      elementRef.current.removeEventListener('mousedown', mousedown)
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
};

export default Element;
