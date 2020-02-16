import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import PanZoomContext, { usePanZoom } from './context';
import useMove from './hooks/useMove';
import useZoom from './hooks/useZoom';
import api from './api';

import './PanZoom.css';

const CLASS_NAME = 'react-panzoom';

const PanZoom = ({
  apiRef, children, className, disabledUserSelect,
}) => {
  const { childRef, elementsRef, setLoading } = usePanZoom();

  const positionRef = useMove();
  const zoomRef = useZoom();

  const classNameMemo = useMemo(() => {
    const classes = [CLASS_NAME];
    if (disabledUserSelect) classes.push(`${CLASS_NAME}--disable-user-select`);
    if (className) classes.push(className);
    return classes.join(' ');
  }, [className, disabledUserSelect]);

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
    elementsRef,
    positionRef,
    zoomRef,
  });

  return (
    <div className={classNameMemo}>
      <div draggable={false} className={classNameChildMemo} ref={createRef}>
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
  disabledUserSelect: PropTypes.bool,
};

PanZoom.defaultProps = {
  apiRef: null,
  className: null,
  disabledUserSelect: false,
};

const PanZoomWithContext = (props, ref) => (
  <PanZoomContext {...props}>
    <PanZoom apiRef={ref} {...props} />
  </PanZoomContext>
);

export default forwardRef(PanZoomWithContext);
