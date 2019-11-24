import positionClone from './helpers/positionClone';
import transform from './helpers/produceStyle';

const move = ({
  apiRef, positionRef, zoomRef,
}) => (x, y) => {
  const api = apiRef;
  const position = positionRef;

  if (position.current) {
    position.current = {
      x: positionRef.current.x + x,
      y: positionRef.current.y + y,
    };
  } else {
    position.current = { x, y };
  }

  api.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current });

  return positionClone(positionRef.current);
};

const getPosition = ({ positionRef }) => positionClone(positionRef.current);

const api = ({
  apiRef, childRef, positionRef, zoomRef,
}) => {
  if (!apiRef) return;

  const apiExternal = apiRef;
  apiExternal.current = {
    move: move({
      apiRef,
      childRef,
      positionRef,
      zoomRef,
    }),
    getPosition: getPosition({ positionRef }),
  };
};

export default api;
