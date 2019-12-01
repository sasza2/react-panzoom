import positionClone from '../helpers/positionClone';
import transform from '../helpers/produceStyle';

const move = ({
  childRef, positionRef, zoomRef,
}) => (x, y) => {
  const ref = childRef;
  const position = positionRef;

  if (position.current) {
    position.current = {
      x: positionRef.current.x + x,
      y: positionRef.current.y + y,
    };
  } else {
    position.current = { x, y };
  }

  ref.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current });

  return positionClone(positionRef);
};

export default move;
