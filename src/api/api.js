import { useImperativeHandle } from 'react';

import getElements from './elements';
import move from './move';
import { getPosition, setPosition } from './position';
import {
  getZoom,
  setZoom,
  zoomIn,
  zoomOut,
} from './zoom';
import reset from './reset';

const api = ({
  apiRef, childRef, elementsRef, positionRef, zoomRef,
}) => {
  if (!apiRef) return;

  const apiExternal = apiRef;
  useImperativeHandle(apiExternal, () => ({
    move: move({
      apiRef,
      childRef,
      getZoom,
      positionRef,
      setZoom,
      zoomRef,
    }),
    getElements: getElements({ elementsRef }),
    getPosition: getPosition({ positionRef }),
    setPosition: setPosition({ childRef, positionRef, zoomRef }),
    getZoom: getZoom({ zoomRef }),
    setZoom: setZoom({ childRef, positionRef, zoomRef }),
    zoomIn: zoomIn({ childRef, positionRef, zoomRef }),
    zoomOut: zoomOut({ childRef, positionRef, zoomRef }),
    reset: reset({ childRef, positionRef, zoomRef }),
  }));
};

export default api;
