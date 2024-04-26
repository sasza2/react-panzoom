import React, {
  useImperativeHandle, useMemo, useRef, useState,
} from 'react';

import { PanZoomApi, PanZoomOptions } from 'types';
import ElementsContext from './ElementsContext';
import useDidUpdateEffect from './useDidUpdateEffect';

type PanZoomReturn = {
  childRef: React.MutableRefObject<HTMLDivElement>,
  parentRef:React.MutableRefObject<HTMLDivElement>,
  panZoomRef: React.MutableRefObject<PanZoomApi>,
  render: JSX.Element,
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>,
}

const usePanZoom = <T extends keyof PanZoomOptions, >({
  allowedProps,
  apiRef,
  children,
  props,
}: React.PropsWithChildren<{
  allowedProps: Array<T>,
  apiRef: React.Ref<PanZoomApi>,
  props: PanZoomOptions,
}>): PanZoomReturn => {
  const childRef = useRef<HTMLDivElement>();
  const parentRef = useRef<HTMLDivElement>();
  const panZoomRef = useRef<PanZoomApi>(null);
  const [initialized, setInitialized] = useState(false);

  const deps = allowedProps.map((propName) => props[propName]);

  useDidUpdateEffect(() => {
    if (panZoomRef.current) panZoomRef.current.setOptions(props);
  }, deps);

  useImperativeHandle(
    initialized ? apiRef : undefined,
    () => panZoomRef.current,
    [initialized],
  );

  const value = useMemo(() => ({
    initialized,
    panZoomRef,
  }), [initialized]);

  const render = (
    <ElementsContext.Provider value={value}>
      <div ref={parentRef}>
        <div ref={childRef}>
          {children}
        </div>
      </div>
    </ElementsContext.Provider>
  );

  return {
    childRef,
    parentRef,
    panZoomRef,
    render,
    setInitialized,
  };
};

export default usePanZoom;
