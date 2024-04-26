import React, {
  forwardRef, Ref, useLayoutEffect,
} from 'react';
import initPanZoom, { getAllowedProps } from 'panzoom-core';

import { PanZoomApi, PanZoomProps, PanZoomPropsRef } from 'types';
import usePanZoom from './usePanZoom';

const panZoomAllowedProps = getAllowedProps();

const PanZoom: React.FC<PanZoomProps & { apiRef?: Ref<PanZoomApi> }> = ({
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
    panZoomRef.current.setOptions(props)
    setInitialized(true);
    return panZoomRef.current.destroy;
  }, []);

  return render;
};

const PanZoomRef = forwardRef((props: PanZoomProps, ref: Ref<PanZoomApi>) => (
  <PanZoom {...props} apiRef={ref} />
)) as React.FC<PanZoomPropsRef>;

PanZoomRef.displayName = 'PanZoom';

export default PanZoomRef;
