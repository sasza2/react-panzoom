import positionClone from './helpers/positionClone';
import transform from './helpers/produceStyle';

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

  return positionClone(positionRef.current);
};

const getPosition = ({ positionRef }) => () => positionClone(positionRef.current);

const setPosition = ({ childRef, positionRef, zoomRef }) => (x, y) => {
  const ref = childRef;
  const position = positionRef;
  position.current = { x, y };
  ref.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current });
};

const getZoom = ({ zoomRef }) => () => zoomRef.current;

const setZoom = ({ childRef, positionRef, zoomRef }) => (value) => {
  const ref = childRef;
  const zoom = zoomRef;
  zoom.current = value;
  ref.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current });
};

const api = ({
  apiRef, childRef, positionRef, zoomRef,
}) => {
  if (!apiRef) return;

  const apiExternal = apiRef;
  apiExternal.current = {
    move: move({
      apiRef,
      childRef,
      getZoom,
      positionRef,
      setZoom,
      zoomRef,
    }),
    getPosition: getPosition({ positionRef }),
    setPosition: setPosition({ childRef, positionRef, zoomRef }),
    getZoom: getZoom({ zoomRef }),
    setZoom: setZoom({ childRef, positionRef, zoomRef }),
  };
};

export default api;
