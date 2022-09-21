import React, {
  memo, RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';

import { Position } from 'types'
import { usePanZoom } from 'context';
import { ELEMENT_STYLE, ELEMENT_STYLE_DISABLED } from 'styles';
import { onMouseDown, onMouseUp as onMouseUpListener, onMouseMove } from 'helpers/eventListener';
import produceStyle from 'helpers/produceStyle';
import stopEventPropagation from 'helpers/stopEventPropagation';
import { useElementMouseDownPosition, useElementMouseMovePosition } from 'hooks/useElementEventPosition';

let lastZIndex = 2;

type Moving = Record<string, Position>

type OnClick = (props: {
  id: string | number,
  family?: string,
  e: MouseEvent,
  stop: () => void,
} & Position) => unknown

type OnMouseUp = (props: {
  id: string | number,
  family?: string,
  e: MouseEvent,
} & Position) => unknown

type ElementProps = {
  disabled?: boolean,
  draggableSelector?: string,
  family?: string,
  id: string | number,
  onClick?: OnClick,
  onMouseUp?: OnMouseUp,
  x: number,
  y: number,
}

const Element: React.FC<ElementProps> = ({
  children,
  disabled = false,
  draggableSelector,
  family,
  id,
  onClick,
  onMouseUp,
  x = 0,
  y = 0,
}) => {
  if (!id) throw new Error("'id' prop for element can't be undefined");

  const mouseDownPosition = useElementMouseDownPosition();
  const mouseMovePosition = useElementMouseMovePosition();

  const [moving, setMoving] = useState<Moving>(null);
  const elementRef: RefObject<HTMLDivElement> = useRef();

  const {
    boundary,
    disabledElements,
    elementsRef,
    onElementsChange,
  } = usePanZoom();

  useLayoutEffect(() => {
    const position = { x, y };

    elementRef.current.style.transform = produceStyle({ position });
    elementsRef.current[id as string] = {
      family,
      id,
      node: elementRef,
      position,
    };

    return () => {
      delete elementsRef.current[id as string];
    };
  }, [id, x, y]);

  useEffect(() => {
    if (!moving || disabledElements) return undefined;

    const mousemove = (e: MouseEvent) => {
      const elementsChange: Moving = {}

      Object.entries(moving).forEach(([currentElementId, from]) => {
        const currentElement = elementsRef.current[currentElementId];

        const position = mouseMovePosition(e, from, currentElement.node);

        elementsChange[currentElementId] = position;

        currentElement.position = position
        currentElement.node.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      });

      if (onElementsChange) onElementsChange(elementsChange);
    };

    const mouseup = (e: MouseEvent) => {
      setMoving(null);

      if (onMouseUp) {
        onMouseUp({
          id,
          family,
          e,
          ...elementsRef.current[id as string].position,
        });
      }
    };

    const mouseMoveClear = onMouseMove(mousemove);
    const mouseUpClear = onMouseUpListener(mouseup);

    return () => {
      mouseMoveClear();
      mouseUpClear();
    };
  }, [boundary, disabledElements, id, moving, onElementsChange]);

  useLayoutEffect(() => {
    if (disabled) return undefined;

    const increaseZIndex = () => {
      lastZIndex += 1;
      elementRef.current.style.zIndex = lastZIndex.toString();
    };

    const mousedown = (e: MouseEvent) => {
      console.log(e.target)
      if (draggableSelector && !(e.target as HTMLElement).closest(draggableSelector)) return

      const elements = Object.values(elementsRef.current)
        .filter((element) => element.id === id || (family && element.family === family));

      const position = mouseDownPosition(e, elementRef);
      const stop = stopEventPropagation();

      if (onClick) {
        onClick({
          id,
          family,
          e,
          stop,
          ...position,
        });
      }

      e.preventDefault();
      e.stopPropagation();

      if (stop.done) return;

      setMoving(elements.reduce((curr, element) => {
        const from = mouseDownPosition(e, element.node);
        curr[element.id] = from
        return curr;
      }, {} as Moving));

      increaseZIndex();
    };

    const mouseDownClear = onMouseDown(elementRef.current, mousedown);
    return mouseDownClear;
  }, [disabled, family, id]);

  const className = useMemo(() => {
    const base = 'react-panzoom-element';
    const classes = [base];
    if (disabled) classes.push(`${base}--disabled`);
    classes.push(`${base}--id-${id}`);
    return classes.join(' ');
  }, [disabled, id]);

  const elementStyle: React.CSSProperties = useMemo(() => {
    let style = { ...ELEMENT_STYLE };
    if (disabled) style = { ...style, ...ELEMENT_STYLE_DISABLED }
    return style as React.CSSProperties;
  }, [disabled]);

  return (
    <div ref={elementRef} className={className} style={elementStyle}>
      {children}
    </div>
  );
};

export default memo(Element);
