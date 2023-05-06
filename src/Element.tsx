import React, { useContext, useLayoutEffect, useRef } from 'react';

import { ElementApi, ElementProps } from 'types';
import ElementsContext from './ElementsContext';
import useDidUpdateEffect from './useDidUpdateEffect';

const Element: React.FC<ElementProps> = ({
  children,
  className,
  disabled,
  draggableSelector,
  family,
  followers,
  height,
  id,
  onAfterResize,
  onClick,
  onMouseUp,
  resizable,
  resizedMaxWidth,
  resizedMinWidth,
  resizerWidth,
  width,
  x,
  y,
}) => {
  const nodeRef = useRef<HTMLDivElement>();
  const elementRef = useRef<ElementApi>();
  const { initialized, panZoomRef } = useContext(ElementsContext);

  const options = {
    className: className || 'react-panzoom-element',
    id,
    disabled,
    draggableSelector,
    family,
    followers,
    height,
    onAfterResize,
    onClick,
    onMouseUp,
    resizable,
    resizedMaxWidth,
    resizedMinWidth,
    resizerWidth,
    width,
    x,
    y,
  };

  useLayoutEffect(() => {
    if (!initialized) return undefined;

    elementRef.current = panZoomRef.current.addElement(nodeRef.current, options);
    return elementRef.current.destroy;
  }, [initialized]);

  useDidUpdateEffect(() => {
    elementRef.current.setOptions(options);
  }, [
    disabled,
    draggableSelector,
    family,
    JSON.stringify(followers),
    height,
    id,
    onAfterResize,
    onClick,
    onMouseUp,
    resizable,
    resizedMaxWidth,
    resizedMinWidth,
    resizerWidth,
    width,
    x,
    y,
  ]);

  return (
    <div ref={nodeRef}>{children}</div>
  );
};

export default Element;
