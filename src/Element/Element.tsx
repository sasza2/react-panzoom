import React, {
  memo, RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';

import { ElementProps, Position } from 'types'
import { usePanZoom } from 'context';
import { ELEMENT_STYLE, ELEMENT_STYLE_DISABLED } from 'styles';
import { onMouseDown, onMouseUp as onMouseUpListener, onMouseMove } from 'helpers/eventListener';
import produceStyle from 'helpers/produceStyle';
import stopEventPropagation from 'helpers/stopEventPropagation';
import { useElementMouseDownPosition, useElementMouseMovePosition } from 'hooks/useElementEventPosition';

let lastZIndex = 2;

type Moving = Record<string, Position>

type FindMin = () => ((currentPositionValue: number, nextPositionValue: number) => void) & { value: number }

const Element: React.FC<ElementProps> = ({
  children,
  className,
  disabled = false,
  draggableSelector,
  family,
  followers = [],
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
    blockMovingRef,
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
    if (disabledElements || !moving) return undefined

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

    const mouseUpClear = onMouseUpListener(elementRef.current, mouseup);

    return () => {
      mouseUpClear()
    }
  }, [disabledElements, id, !!moving])

  useEffect(() => {
    if (!moving || disabledElements) return undefined;

    const mousemove = (e: MouseEvent) => {
      if (blockMovingRef.current) {
        setMoving(null)
        return
      }

      const elementsChange: Moving = {}

      const findMinDiffBetweenPositions: FindMin = () => {
        let value: number | null = null
        const func = (currentPositionValue: number, nextPositionValue: number) => {
          if (value === null || Math.abs(currentPositionValue - nextPositionValue) < Math.abs(value)) {
            func.value = value = currentPositionValue - nextPositionValue
          }
        }
        func.value = value
        return func
      }

      const xMinFind = findMinDiffBetweenPositions()
      const yMinFind = findMinDiffBetweenPositions()

      Object.entries(moving).forEach(([currentElementId, from]) => {
        const currentElement = elementsRef.current[currentElementId];

        const position = mouseMovePosition(e, from, currentElement.node);

        xMinFind(currentElement.position.x, position.x)
        yMinFind(currentElement.position.y, position.y)
      });

      Object.entries(moving).forEach(([currentElementId]) => {
        const currentElement = elementsRef.current[currentElementId];

        const position: Position = {
          x: currentElement.position.x - xMinFind.value,
          y: currentElement.position.y - yMinFind.value,
        }

        elementsChange[currentElementId] = position;

        currentElement.position = position
        currentElement.node.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      })

      if (onElementsChange) onElementsChange(elementsChange);
    };

    const mouseMoveClear = onMouseMove(mousemove);

    return mouseMoveClear
  }, [JSON.stringify(boundary), disabledElements, id, moving, onElementsChange]);

  useLayoutEffect(() => {
    if (disabled) return undefined;

    const increaseZIndex = () => {
      lastZIndex += 1;
      elementRef.current.style.zIndex = lastZIndex.toString();
    };

    const mousedown = (e: MouseEvent) => {
      if (draggableSelector && !(e.target as HTMLElement).closest(draggableSelector)) return

      const elements = Object.values(elementsRef.current)
        .filter((element) =>
          element.id === id
          || (family && element.family === family)
          || followers.includes(element.id)
        );

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
  }, [disabled, family, JSON.stringify(followers), id]);

  const classNameWrapper = useMemo(() => {
    const base = 'react-panzoom-element';
    const classes = [base];
    if (className) classes.push(className)
    if (disabled) classes.push(`${base}--disabled`);
    classes.push(`${base}--id-${id}`);
    return classes.join(' ');
  }, [className, disabled, id]);

  const elementStyle: React.CSSProperties = useMemo(() => {
    let style = { ...ELEMENT_STYLE };
    if (disabled) style = { ...style, ...ELEMENT_STYLE_DISABLED }
    return style as React.CSSProperties;
  }, [disabled]);

  return (
    <div ref={elementRef} className={classNameWrapper} style={elementStyle}>
      {children}
    </div>
  );
};

export default memo(Element);
