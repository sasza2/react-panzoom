import { usePanZoom } from 'context';

const useEventsCallback = () => {
  const {
    onContainerChange,
    onContainerPositionChange,
    onContainerZoomChange,
    positionRef,
    zoomRef,
  } = usePanZoom();

  const dispatchEvents = ({ position, zoom }) => {
    const eventValue = {
      position: { ...positionRef.current },
      zoom: zoomRef.current,
    };

    if (position && onContainerChange) onContainerChange(eventValue);
    if (position && onContainerPositionChange) onContainerPositionChange(eventValue);
    if (zoom && onContainerZoomChange) onContainerZoomChange(eventValue);
  };

  const withDispatch = (apiCallback, options) => (...values) => {
    const result = apiCallback(...values);
    dispatchEvents(options);
    return result;
  };

  const withEventAll = (apiCallback) => withDispatch(
    apiCallback,
    { position: true, zoom: true },
  );

  const withEventPosition = (apiCallback) => withDispatch(
    apiCallback,
    { position: true, zoom: false },
  );

  const withEventZoom = (apiCallback) => withDispatch(
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
