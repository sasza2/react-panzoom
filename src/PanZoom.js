import React, { forwardRef, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import PanZoomContext from './context';
import useMove from './hooks/useMove';
import useZoom from './hooks/useZoom';
import api from './api';

/*
  TODO props:
  - preventSelection,
  - onChange,
  - <Moveable />
*/
const PanZoom = ({ apiRef, children, className }) => {
  const [loading, setLoading] = useState(true);
  const childRef = useRef();

  const positionRef = useMove(childRef, loading);
  const zoomRef = useZoom(childRef, loading);

  const createRef = (node) => {
    childRef.current = node;
    setLoading(false);
  };

  api({
    apiRef,
    childRef,
    positionRef,
    zoomRef,
  });

  const wrapperStyle = {
    overflow: 'hidden',
  };

  const childStyle = {
    transformOrigin: '0 0',
    pointerEvents: 'none',
  };

  return (
    <div className={className} style={wrapperStyle}>
      <div className={className && `${className}__in`} ref={createRef} style={childStyle}>
        {children}
      </div>
    </div>
  );
};

PanZoom.propTypes = {
  apiRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object }),
  ]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

PanZoom.defaultProps = {
  apiRef: null,
  className: null,
};

const PanZoomWithContext = (props, ref) => (
  <PanZoomContext {...props}>
    <PanZoom apiRef={ref} {...props} />
  </PanZoomContext>
);

export default forwardRef(PanZoomWithContext);
