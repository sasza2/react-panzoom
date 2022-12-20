import React, {
  memo, MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';

import { ElementsInMove, ElementProps } from 'types';
import { usePanZoom } from '@/context';
import { ELEMENT_STYLE, ELEMENT_STYLE_DISABLED } from '@/styles';
import { useElements } from '@/ElementsProvider';
import { onMouseDown, onMouseUp as onMouseUpListener, onMouseMove } from '@/helpers/eventListener';
import positionFromEvent from '@/helpers/positionFromEvent';
import produceStyle from '@/helpers/produceStyle';
import stopEventPropagation from '@/helpers/stopEventPropagation';
import updateFamilyOfElementsPosition from '@/helpers/updateFamilyOfElementsPosition';
import { useElementMouseDownPosition, useElementMouseMovePosition } from '@/hooks/useElementEventPosition';

let lastZIndex = 2;

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

  const [isMoved, setIsMoved] = useState<boolean>(false);
  const elementRef: MutableRefObject<HTMLDivElement> = useRef();

  const mouseDownPosition = useElementMouseDownPosition();
  const mouseMovePosition = useElementMouseMovePosition();

  const {
    blockMovingRef,
    boundary,
    disabledElements,
    onElementsChangeRef,
  } = usePanZoom();

  const {
    elementsInMove,
    elementsRef,
    lastElementMouseMoveEventRef,
    setElementsInMove,
  } = useElements();

  const onClickRef = useRef<typeof onClick>();
  onClickRef.current = onClick;

  const onMouseUpRef = useRef<typeof onMouseUp>();
  onMouseUpRef.current = onMouseUp;

  const onElementsAction = (nextElementsInMove: ElementsInMove) => {
    setElementsInMove(nextElementsInMove);
    setIsMoved(!!nextElementsInMove);
  };

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
    if (disabledElements || !isMoved) return undefined;

    const mouseup = (e: MouseEvent) => {
      onElementsAction(null);

      if (onMouseUpRef.current) {
        onMouseUpRef.current({
          id,
          family,
          e,
          ...elementsRef.current[id as string].position,
        });
      }
    };

    const mouseUpClear = onMouseUpListener(elementRef.current, mouseup);

    return () => {
      mouseUpClear();
    };
  }, [disabledElements, id, isMoved]);

  useEffect(() => {
    if (disabledElements || !elementsInMove || !isMoved) return undefined;

    const mousemove = (e: MouseEvent) => {
      if (blockMovingRef.current) {
        onElementsAction(null);
        return;
      }

      lastElementMouseMoveEventRef.current = positionFromEvent(e);

      updateFamilyOfElementsPosition({
        elementsRef,
        elementsInMove,
        produceNextPosition: (from, currentElement) => {
          const position = mouseMovePosition(e, from, currentElement.node);
          return position;
        },
        onElementsChange: onElementsChangeRef.current,
      });
    };

    const mouseMoveClear = onMouseMove(mousemove);

    return () => {
      mouseMoveClear();
      if (isMoved) setElementsInMove(null);
    };
  }, [JSON.stringify(boundary), disabledElements, elementsInMove, id, isMoved]);

  useLayoutEffect(() => {
    if (disabled) return undefined;

    const increaseZIndex = () => {
      lastZIndex += 1;
      elementRef.current.style.zIndex = lastZIndex.toString();
    };

    const mousedown = (e: MouseEvent) => {
      if (e.button) return;
      if (draggableSelector && !(e.target as HTMLElement).closest(draggableSelector)) return;

      const elements = Object.values(elementsRef.current)
        .filter((element) => element.id === id
          || (family && element.family === family)
          || followers.includes(element.id));

      const position = mouseDownPosition(e, elementRef);
      const stop = stopEventPropagation();

      if (onClickRef.current) {
        onClickRef.current({
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

      onElementsAction(elements.reduce((curr, element) => {
        curr[element.id] = mouseDownPosition(e, element.node);
        return curr;
      }, {} as ElementsInMove));

      increaseZIndex();
    };

    const mouseDownClear = onMouseDown(elementRef.current, mousedown);
    return mouseDownClear;
  }, [disabled, family, JSON.stringify(followers), id]);

  const classNameWrapper = useMemo(() => {
    const base = 'react-panzoom-element';
    const classes = [base];
    if (className) classes.push(className);
    if (disabled) classes.push(`${base}--disabled`);
    classes.push(`${base}--id-${id}`);
    return classes.join(' ');
  }, [className, disabled, id]);

  const elementStyle: React.CSSProperties = useMemo(() => {
    let style = { ...ELEMENT_STYLE };
    if (disabled) style = { ...style, ...ELEMENT_STYLE_DISABLED };
    return style as React.CSSProperties;
  }, [disabled]);

  return (
    <div ref={elementRef} className={classNameWrapper} style={elementStyle}>
      {children}
    </div>
  );
};

export default memo(Element);
