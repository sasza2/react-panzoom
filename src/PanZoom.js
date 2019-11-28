import React, {
  forwardRef, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import PanZoomContext from './context';
import useMove from './hooks/useMove';
import useZoom from './hooks/useZoom';
import api from './api';

import './PanZoom.css';

const CLASS_NAME = 'react-panzoom';

/*
  TODO props:
  - <Moveable />
*/
const PanZoom = ({
  apiRef, children, className, disableUserSelect,
}) => {
  const [loading, setLoading] = useState(true);
  const childRef = useRef();

  const positionRef = useMove(childRef, loading);
  const zoomRef = useZoom(childRef, loading);

  const classNameMemo = useMemo(() => {
    const classes = [CLASS_NAME];
    if (disableUserSelect) classes.push(`${CLASS_NAME}--disable-user-select`);
    if (className) classes.push(className);
    return classes.join(' ');
  }, [className, disableUserSelect]);

  const classNameChildMemo = useMemo(() => {
    const classes = [`${CLASS_NAME}__in`];
    if (className) classes.push(`${className}__in`);
    return classes.join(' ');
  }, [className]);

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

  return (
    <div className={classNameMemo}>
      <div className={classNameChildMemo} ref={createRef}>
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
  disableUserSelect: PropTypes.bool,
};

PanZoom.defaultProps = {
  apiRef: null,
  className: null,
  disableUserSelect: false,
};

const PanZoomWithContext = (props, ref) => (
  <PanZoomContext {...props}>
    <PanZoom apiRef={ref} {...props} />
  </PanZoomContext>
);

export default forwardRef(PanZoomWithContext);
