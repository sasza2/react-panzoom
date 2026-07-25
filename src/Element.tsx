import React, { useContext, useLayoutEffect, useRef } from 'react';

import { ElementApi, ElementProps } from 'types';
import ElementsContext from './ElementsContext';
import useDidUpdateEffect from './useDidUpdateEffect';

const Element: React.FC<ElementProps> = ({
  children,
  className,
  disabled,
  disabledMove,
  disabledMoveHorizontal,
  disabledMoveVertical,
  draggableSelector,
  family,
  followers,
  height,
  id,
  onAfterResize,
  onClick,
  onContextMenu,
  onMouseUp,
  onStartResizing,
  resizable,
  resizableVertical,
  resizedMaxHeight,
  resizedMaxWidth,
  resizedMinHeight,
  resizedMinWidth,
  resizerHeight,
  resizerWidth,
  width,
  x,
  y,
  zIndex,
}) => {
  const nodeRef = useRef<HTMLDivElement>();
  const elementRef = useRef<ElementApi>();
  const { initialized, panZoomRef } = useContext(ElementsContext);

  const options = {
    className: className || 'react-panzoom-element',
    id,
    disabled,
    disabledMove,
    disabledMoveHorizontal,
    disabledMoveVertical,
    draggableSelector,
    family,
    followers,
    height,
    onAfterResize,
    onClick,
    onContextMenu,
    onMouseUp,
    onStartResizing,
    resizable,
    resizableVertical,
    resizedMaxHeight,
    resizedMaxWidth,
    resizedMinHeight,
    resizedMinWidth,
    resizerHeight,
    resizerWidth,
    width,
    x,
    y,
    zIndex,
  };

  useLayoutEffect(() => {
    if (!initialized) return undefined;

    elementRef.current = panZoomRef.current.addElement(nodeRef.current, options);
    return elementRef.current.destroy;
  }, [initialized]);

  useDidUpdateEffect(() => {
    /* v8 ignore next */
    if (!initialized || !elementRef.current) return;
    elementRef.current.setOptions(options);
  }, [
    disabled,
    disabledMove,
    disabledMoveHorizontal,
    disabledMoveVertical,
    draggableSelector,
    family,
    initialized,
    JSON.stringify(followers),
    height,
    id,
    onAfterResize,
    onClick,
    onContextMenu,
    onMouseUp,
    onStartResizing,
    resizable,
    resizableVertical,
    resizedMaxHeight,
    resizedMaxWidth,
    resizedMinHeight,
    resizedMinWidth,
    resizerHeight,
    resizerWidth,
    width,
    x,
    y,
    zIndex,
  ]);

  return (
    <div ref={nodeRef}>{children}</div>
  );
};

export default Element;
