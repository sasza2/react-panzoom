import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import PanZoomContext from './PanZoomContext';

const PanZoomProvider = ({
  children,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const childRef = useRef();
  const elementsRef = useRef({});
  const positionRef = useRef();
  const zoomRef = useRef();

  if (!zoomRef.current) zoomRef.current = 1;
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 };

  return (
    <PanZoomContext.Provider
      value={{
        childRef,
        elementsRef,
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
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  disabledElements: PropTypes.bool,
  disabledMove: PropTypes.bool,
  disabledUserSelect: PropTypes.bool,
  disabledZoom: PropTypes.bool,
  onElementsChange: PropTypes.func,
  onContainerChange: PropTypes.func,
  onContainerClick: PropTypes.func,
  onContainerPositionChange: PropTypes.func,
  onContainerZoomChange: PropTypes.func,
  selecting: PropTypes.bool,
  zoomMax: PropTypes.number,
  zoomMin: PropTypes.number,
  zoomSpeed: PropTypes.number,
  zoomStep: PropTypes.number,
};

PanZoomProvider.defaultProps = {
  boundary: {},
  disabled: false,
  disabledElements: false,
  disabledMove: false,
  disabledUserSelect: false,
  disabledZoom: false,
  onElementsChange: null,
  onContainerChange: null,
  onContainerClick: null,
  onContainerPositionChange: null,
  onContainerZoomChange: null,
  selecting: false,
  zoomMax: null,
  zoomMin: 0.1,
  zoomSpeed: 1,
  zoomStep: 0.05,
};

export default PanZoomProvider;
