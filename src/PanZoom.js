import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import { PARENT_STYLE, CHILD_STYLE, CHILD_DISABLED_STYLE } from './styles';
import PanZoomProvider, { usePanZoom } from './context';
import useApi from './hooks/useApi';
import useMove from './hooks/useMove';
import useZoom from './hooks/useZoom';

const CLASS_NAME = 'react-panzoom';

const PanZoom = ({
  children, className, disabledUserSelect, height, width,
}) => {
  const { childRef, setLoading } = usePanZoom();

  useMove();
  useZoom();
  useApi();

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

  const childStyle = useMemo(() => {
    let style = {
      ...CHILD_STYLE,
      height,
      width,
    };

    if (className) style.backgroundColor = null;
    if (disabledUserSelect) style = { ...style, ...CHILD_DISABLED_STYLE };

    return style;
  }, [className, disabledUserSelect, height, width]);

  const createRef = (node) => {
    childRef.current = node;
    setLoading(false);
  };

  return (
    <div className={classNameMemo} style={PARENT_STYLE}>
      <div draggable={false} className={classNameChildMemo} ref={createRef} style={childStyle}>
        {children}
      </div>
    </div>
  );
};

PanZoom.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabledUserSelect: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

PanZoom.defaultProps = {
  className: null,
  disabledUserSelect: false,
  height: '100%',
  width: '100%',
};

const PanZoomWithContext = (props, apiRef) => (
  <PanZoomProvider apiRef={apiRef} {...props}>
    <PanZoom {...props} />
  </PanZoomProvider>
);

export default forwardRef(PanZoomWithContext);
