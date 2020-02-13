import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import PanZoomContext from './PanZoomContext';

const PanZoomProvider = ({
  children,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const childRef = useRef();
  const elementsMapRef = useRef();
  const positionRef = useRef();
  const zoomRef = useRef();

  if (!zoomRef.current) zoomRef.current = 1;
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 };

  return (
    <PanZoomContext.Provider
      value={{
        childRef,
        elementsMapRef,
        loading,
        positionRef,
        setLoading,
        zoomRef,
        ...props,
      }}
    >
      {children}
    </PanZoomContext.Provider>
  );
};

PanZoomProvider.propTypes = {
  boundary: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  capturing: PropTypes.bool,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  disabledMove: PropTypes.bool,
  disabledZoom: PropTypes.bool,
  onChange: PropTypes.func,
  onElementsChange: PropTypes.func,
  onPositionChange: PropTypes.func,
  onZoomChange: PropTypes.func,
  zoomMax: PropTypes.number,
  zoomMin: PropTypes.number,
  zoomSpeed: PropTypes.number,
  zoomStep: PropTypes.number,
};

PanZoomProvider.defaultProps = {
  boundary: {},
  capturing: false,
  disabled: false,
  disabledMove: false,
  disabledZoom: false,
  onChange: null,
  onElementsChange: null,
  onPositionChange: null,
  onZoomChange: null,
  zoomMax: null,
  zoomMin: 0.1,
  zoomSpeed: 1,
  zoomStep: 0.05,
};

export default PanZoomProvider;
