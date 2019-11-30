import transform from '../helpers/produceStyle';

const reset = ({ childRef, positionRef, zoomRef }) => () => {
  const ref = childRef;
  const zoom = zoomRef;
  const position = positionRef;
  zoom.current = 1;
  position.current = { x: 0, y: 0 };
  ref.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current });
};

export default reset;
