import { usePanZoom } from '../context';
import positionFromEvent from '../helpers/positionFromEvent';

const useContainerMouseDownPosition = () => {
  const {
    childRef,
    positionRef,
  } = usePanZoom();

  return (e) => {
    const eventPosition = positionFromEvent(e);
    const rect = childRef.current.parentNode.getBoundingClientRect();

    return {
      x: eventPosition.clientX - rect.left - (positionRef.current.x || 0),
      y: eventPosition.clientY - rect.top - (positionRef.current.y || 0),
    };
  };
};

export default useContainerMouseDownPosition;
