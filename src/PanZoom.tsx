import React, { forwardRef, useMemo } from 'react';

import { PanZoomProps } from 'types'
import useApi from './hooks/useApi';
import useCover from 'hooks/useCover';
import useMove from './hooks/useMove';
import useZoom from './hooks/useZoom';
import Select from './Select';
import {
  CLASS_NAME, PARENT_STYLE, CHILD_STYLE, CHILD_DISABLED_STYLE,
} from './styles';
import ElementsProvider from './ElementsProvider'
import PanZoomProvider, { usePanZoom } from './context';

const PanZoom: React.FC<PanZoomProps> = ({
  children,
  className,
  disabled,
  disabledUserSelect,
  height = '100%',
  width = '100%',
  selecting,
  cover,
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
    let style: React.CSSProperties = {
      ...CHILD_STYLE,
      height,
      width,
    };

    if (disabledUserSelect)
      style = { ...style, ...CHILD_DISABLED_STYLE } as React.CSSProperties;
    if (selecting) style.pointerEvents = 'all';
    if (cover) style.backgroundImage = 'url(' + cover + ')';

    return style;
  }, [className, disabledUserSelect, height, width, selecting, cover]);

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
    <ElementsProvider>
      <PanZoom {...props} />
    </ElementsProvider>
  </PanZoomProvider>
);

const PanZoomWithRef = forwardRef(PanZoomWithContext);

const PanZoomWithCover: React.FC<PanZoomProps> = ({
  cover,
  zoomMax,
  width,
  height,
  ...props
}) => {
  const { ref, size, zoom } = useCover(cover);

  return (
    <div style={{ width, height }}>
      <PanZoomWithRef
        {...props}
        {...size}
        ref={ref}
        boundary={{}}
        cover={cover}
        zoomMin={zoom}
        zoomMax={zoomMax * zoom}
      />
    </div>
  );
};

export default PanZoomWithRef;

export { PanZoomWithCover };
