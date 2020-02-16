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
  const elementsChangesRef = useRef({});
  const positionRef = useRef();
  const zoomRef = useRef();

  if (!zoomRef.current) zoomRef.current = 1;
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 };

  return (
    <PanZoomContext.Provider
      value={{
        childRef,
        elementsRef,
        elementsChangesRef,
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
  elementsInterval: PropTypes.number,
  onContainerChange: PropTypes.func,
  onElementsChange: PropTypes.func,
  onContainerPositionChange: PropTypes.func,
  onContainerZoomChange: PropTypes.func,
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
  elementsInterval: 250,
  onContainerChange: null,
  onElementsChange: null,
  onContainerPositionChange: null,
  onContainerZoomChange: null,
  zoomMax: null,
  zoomMin: 0.1,
  zoomSpeed: 1,
  zoomStep: 0.05,
};

export default PanZoomProvider;
