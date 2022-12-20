import React, { PropsWithChildren, useRef, useState } from 'react';

import {
  ZOOM_INITIAL, ZOOM_MIN_DEFAULT, ZOOM_MAX_DEFAULT, ZOOM_SPEED_DEFAULT,
} from '@/consts';
import { PanZoomProps, Position, Zoom } from 'types';
import PanZoomContext from './PanZoomContext';

const PanZoomProvider: React.FC<PropsWithChildren<PanZoomProps>> = ({
  children,
  height = '100%',
  width = '100%',
  zoomInitial = ZOOM_INITIAL,
  zoomMin = ZOOM_MIN_DEFAULT,
  zoomMax = ZOOM_MAX_DEFAULT,
  zoomSpeed = ZOOM_SPEED_DEFAULT,
  onElementsChange,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const childRef = useRef();
  const blockMovingRef = useRef<boolean>(false);
  const onElementsChangeRef = useRef<typeof onElementsChange>();
  onElementsChangeRef.current = onElementsChange;
  const positionRef = useRef<Position>();
  const zoomRef: Zoom = useRef<number>();

  if (!zoomRef.current) zoomRef.current = zoomInitial;
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 };

  return (
    <PanZoomContext.Provider
      value={{
        blockMovingRef,
        childRef,
        height,
        loading,
        onElementsChangeRef,
        positionRef,
        setLoading,
        width,
        zoomRef,
        zoomMin,
        zoomMax,
        zoomSpeed,
        ...props,
      }}
    >
      {children}
    </PanZoomContext.Provider>
  );
};

export default PanZoomProvider;
