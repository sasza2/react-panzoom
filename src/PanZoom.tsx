import React, {
  forwardRef, MutableRefObject, useLayoutEffect,
} from 'react';
import initPanZoom, { getAllowedProps } from 'panzoom-core';

import { PanZoomApi, PanZoomProps } from 'types';
import usePanZoom from './usePanZoom';

const panZoomAllowedProps = getAllowedProps();

const PanZoom: React.FC<PanZoomProps & { apiRef?: MutableRefObject<PanZoomApi> }> = ({
  apiRef,
  children,
  ...props
}) => {
  const {
    childRef, panZoomRef, render, setInitialized,
  } = usePanZoom({
    allowedProps: panZoomAllowedProps,
    apiRef,
    children,
    props,
  });

  useLayoutEffect(() => {
    panZoomRef.current = initPanZoom(childRef.current, {
      ...props,
      className: props.className || 'react-panzoom',
    });
    setInitialized(true);
    return panZoomRef.current.destroy;
  }, []);

  return render;
};

// eslint-disable-next-line react/display-name
const PanZoomRef = forwardRef((props: PanZoomProps, ref: MutableRefObject<PanZoomApi>) => (
  <PanZoom {...props} apiRef={ref} />
)) as React.FC<PanZoomProps & { ref?: MutableRefObject<PanZoomApi> }>;

export default PanZoomRef;
