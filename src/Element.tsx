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
  id,
  onAfterResize,
  onClick,
  onMouseUp,
  resizable,
  resizedMaxWidth,
  resizedMinWidth,
  resizerWidth,
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
    onAfterResize,
    onClick,
    onMouseUp,
    resizable,
    resizedMaxWidth,
    resizedMinWidth,
    resizerWidth,
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
    id,
    onAfterResize,
    onClick,
    onMouseUp,
    resizable,
    resizedMaxWidth,
    resizedMinWidth,
    resizerWidth,
    x,
    y,
  ]);

  return (
    <div ref={nodeRef}>{children}</div>
  );
};

export default Element;
