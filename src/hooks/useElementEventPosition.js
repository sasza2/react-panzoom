import produceElementPosition from '../helpers/produceElementPosition';
import positionFromEvent from '../helpers/positionFromEvent';
import { usePanZoom } from '../context';

export const useElementMouseDownPosition = () => {
  const { childRef, zoomRef } = usePanZoom();

  return (e, elementRef) => {
    const eventPosition = positionFromEvent(e);
    const parent = childRef.current.parentNode.getBoundingClientRect();
    const rect = elementRef.current.getBoundingClientRect();

    return {
      x: (eventPosition.clientX - rect.left + parent.left) / zoomRef.current,
      y: (eventPosition.clientY - rect.top + parent.top) / zoomRef.current,
    };
  };
};

export const useElementMouseMovePosition = () => {
  const { childRef, positionRef, zoomRef } = usePanZoom();
  return (e, from, elementRef) => {
    const eventPosition = positionFromEvent(e);
    return produceElementPosition({
      element: elementRef.current,
      container: childRef.current,
      x: (eventPosition.clientX - positionRef.current.x) / zoomRef.current - from.x,
      y: (eventPosition.clientY - positionRef.current.y) / zoomRef.current - from.y,
      zoom: zoomRef.current,
    });
  };
};
