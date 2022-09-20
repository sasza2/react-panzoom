import React, { useRef, useState } from 'react';

import { Elements, Position, Zoom } from 'types'
import { PanZoomProviderProps } from '../types';
import PanZoomContext from './PanZoomContext';

const PanZoomProvider: React.FC<PanZoomProviderProps> = ({
  children,
  zoomMin = 0.1,
  zoomSpeed = 1,
  zoomStep = 0.05,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const childRef = useRef();
  const elementsRef: Elements = useRef({});
  const positionRef = useRef<Position>();
  const zoomRef: Zoom = useRef<number>();

  if (!zoomRef.current) zoomRef.current = 1;
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 };

  return (
    <PanZoomContext.Provider
      value={{
        childRef,
        elementsRef,
        loading,
        positionRef,
        setLoading,
        zoomRef,
        zoomMin,
        zoomSpeed,
        zoomStep,
        ...props,
      }}
    >
      {children}
    </PanZoomContext.Provider>
  );
};

export default PanZoomProvider;
