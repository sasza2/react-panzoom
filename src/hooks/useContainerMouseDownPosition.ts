import { Position } from 'types';
import { usePanZoom } from '@/context';
import getBoundingClientRect from '@/helpers/getBoundingClientRect';
import positionFromEvent from '@/helpers/positionFromEvent';

const useContainerMouseDownPosition = (): ((
  e: MouseEvent | TouchEvent
) => Position) => {
  const { childRef, positionRef } = usePanZoom();

  return (e: MouseEvent | TouchEvent): Position => {
    const eventPosition = positionFromEvent(e);
    const rect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);

    return {
      x: eventPosition.clientX - rect.left - (positionRef.current.x || 0),
      y: eventPosition.clientY - rect.top - (positionRef.current.y || 0),
    };
  };
};

export default useContainerMouseDownPosition;
