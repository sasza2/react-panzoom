import { ZoomEvent } from 'types';

const calculateTouchPointsArea = (touches: TouchList) => {
  const x = Math.abs(touches.item(0).clientX - touches.item(1).clientX);
  const y = Math.abs(touches.item(0).clientY - touches.item(1).clientY);
  return Math.sqrt(x * x + y * y);
};

type TouchEventToZoomInit = () => [(e: TouchEvent) => ZoomEvent, () => void]

const touchEventToZoomInit: TouchEventToZoomInit = () => {
  let lastArea: number | null = null;
  let points: Record<number, boolean> = {};

  const transform = (e: TouchEvent): ZoomEvent => {
    for (let i = 0; i < e.touches.length; i++) {
      points[e.touches.item(i).identifier] = true;
    }

    if (Object.keys(points).length !== 2) return null;

    e.preventDefault();
    e.stopPropagation();

    let clientX = 0; let
      clientY = 0;
    for (let i = 0; i < e.touches.length; i++) {
      clientX += e.touches.item(i).clientX;
      clientY += e.touches.item(i).clientY;
    }

    clientX /= e.touches.length;
    clientY /= e.touches.length;

    const currentArea = calculateTouchPointsArea(e.touches);
    if (lastArea === null || Math.round(currentArea) === Math.round(lastArea)) {
      lastArea = currentArea;
      return {
        deltaY: 0,
        clientX,
        clientY,
      };
    }

    const deltaY = currentArea > lastArea ? -1 : 1;
    lastArea = currentArea;

    return {
      deltaY,
      clientX,
      clientY,
    } as WheelEvent;
  };

  const reset = (e?: TouchEvent) => {
    if (e) points = {};
    lastArea = null;
  };

  return [transform, reset];
};

export default touchEventToZoomInit;
