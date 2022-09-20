import { usePanZoom } from 'context';

type ApiCallback = (...args: unknown[]) => unknown

type DispatchOptions = { position: boolean, zoom: boolean }

type UseEventsCallback = () => {
  withEventAll: ApiCallback,
  withEventPosition: ApiCallback,
  withEventZoom: ApiCallback,
}

const useEventsCallback: UseEventsCallback = () => {
  const {
    onContainerChange,
    onContainerPositionChange,
    onContainerZoomChange,
    positionRef,
    zoomRef,
  } = usePanZoom();

  const dispatchEvents = ({ position, zoom }: DispatchOptions) => {
    const eventValue = {
      position: { ...positionRef.current },
      zoom: zoomRef.current,
    };

    if (position && onContainerChange) onContainerChange(eventValue);
    if (position && onContainerPositionChange) onContainerPositionChange(eventValue);
    if (zoom && onContainerZoomChange) onContainerZoomChange(eventValue);
  };

  const withDispatch = (apiCallback: ApiCallback, options: DispatchOptions) => (...values: unknown[]) => {
    const result = apiCallback(...values);
    dispatchEvents(options);
    return result;
  };

  const withEventAll = (apiCallback: ApiCallback) => withDispatch(
    apiCallback,
    { position: true, zoom: true },
  );

  const withEventPosition = (apiCallback: ApiCallback) => withDispatch(
    apiCallback,
    { position: true, zoom: false },
  );

  const withEventZoom = (apiCallback: ApiCallback) => withDispatch(
    apiCallback,
    { position: false, zoom: true },
  );

  return {
    withEventAll,
    withEventPosition,
    withEventZoom,
  };
};

export default useEventsCallback;
