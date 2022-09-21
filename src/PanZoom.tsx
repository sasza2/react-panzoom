import React, { forwardRef, useMemo } from 'react';

import { PanZoomProps } from 'types'
import useApi from './hooks/useApi';
import useMove from './hooks/useMove';
import useZoom from './hooks/useZoom';
import Select from './Select';
import {
  CLASS_NAME, PARENT_STYLE, CHILD_STYLE, CHILD_DISABLED_STYLE,
} from './styles';
import PanZoomProvider, { usePanZoom } from './context';

const PanZoom: React.FC<PanZoomProps> = ({
  children,
  className,
  disabled,
  disabledUserSelect,
  height = '100%',
  width = '100%',
  selecting,
}) => {
  const { childRef, setLoading } = usePanZoom();

  useMove();
  useZoom();
  useApi();

  const classNameMemo = useMemo(() => {
    const classes = [CLASS_NAME];
    if (className) classes.push(className);
    if (disabled) classes.push(`${CLASS_NAME}--disabled`);
    if (disabledUserSelect) classes.push(`${CLASS_NAME}--disabled-user-select`);
    return classes.join(' ');
  }, [className, disabled, disabledUserSelect]);

  const classNameChildMemo = useMemo(() => {
    const classes = [`${CLASS_NAME}__in`];
    if (className) {
      classes.push(`${className}__in`);
      if (selecting) classes.push(`${className}__selecting`);
    }
    return classes.join(' ');
  }, [className, selecting]);

  const childStyle: React.CSSProperties = useMemo(() => {
    let style = {
      ...CHILD_STYLE,
      height,
      width,
    };

    if (disabledUserSelect) style = { ...style, ...CHILD_DISABLED_STYLE };
    if (selecting) style.pointerEvents = 'all';

    return style as React.CSSProperties;
  }, [className, disabledUserSelect, height, width, selecting]);

  const createRef = (node: HTMLDivElement) => {
    childRef.current = node;
    setLoading(false);
  };

  return (
    <div className={classNameMemo} style={PARENT_STYLE}>
      <div draggable={false} className={classNameChildMemo} ref={createRef} style={childStyle}>
        {children}
        {selecting && <Select />}
      </div>
    </div>
  );
};

const PanZoomWithContext = (props: PanZoomProps, apiRef: PanZoomProps['apiRef']) => (
  <PanZoomProvider apiRef={apiRef} {...props}>
    <PanZoom {...props} />
  </PanZoomProvider>
);

export default forwardRef(PanZoomWithContext);
