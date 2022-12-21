import React, { forwardRef, useMemo } from 'react';

import { PanZoomDefaultProps } from 'types';
import useApi from './hooks/useApi';
import useMove from './hooks/useMove';
import useZoom from './hooks/useZoom';
import produceStyle from './helpers/produceStyle'
import Select from './Select';
import {
  CLASS_NAME, PARENT_STYLE, CHILD_STYLE, CHILD_DISABLED_STYLE,
} from './styles';
import ElementsProvider from './ElementsProvider';
import PanZoomProvider, { usePanZoom } from './context';

export const PanZoom: React.FC = ({
  children,
}) => {
  const {
    className,
    disabled,
    disabledUserSelect,
    height,
    width,
    selecting,
    positionRef,
    childRef,
    setLoading,
    zoomRef,
  } = usePanZoom();

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
      transform: produceStyle({
        position: positionRef.current,
        zoom: zoomRef.current,
      }),
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

const PanZoomWithContext = (
  { children, ...props }: PanZoomDefaultProps,
  apiRef: PanZoomDefaultProps['apiRef'],
) => (
  <PanZoomProvider apiRef={apiRef} {...props}>
    <ElementsProvider>
      <PanZoom>{children}</PanZoom>
    </ElementsProvider>
  </PanZoomProvider>
);

export default forwardRef(PanZoomWithContext);
