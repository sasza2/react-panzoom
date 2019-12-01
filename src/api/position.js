import positionClone from '../helpers/positionClone';
import transform from '../helpers/produceStyle';

export const getPosition = ({ positionRef }) => () => positionClone(positionRef);

export const setPosition = ({ childRef, positionRef, zoomRef }) => (x, y) => {
  const ref = childRef;
  const position = positionRef;
  position.current = { x, y };
  ref.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current });
};
