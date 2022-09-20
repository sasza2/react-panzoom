type EventNames = Array<'mousedown' | 'mouseup' | 'touchstart' | 'touchend'>

type Callback = (e: MouseEvent) => void

type EventListenerClean = () => void

const eventListener = (node: HTMLDivElement, eventNames: EventNames, callback: Callback): EventListenerClean => {
  eventNames.forEach((eventName) => {
    node.addEventListener(eventName, callback);
  });

  return () => {
    eventNames.forEach((eventName) => {
      node.removeEventListener(eventName, callback);
    });
  };
};

export const onMouseDown = (node: HTMLDivElement, callback: Callback): EventListenerClean => (
  eventListener(node, ['mousedown', 'touchstart'], callback)
);

export const onMouseUp = (callback: Callback): EventListenerClean => (
  eventListener(window, ['mouseup', 'touchend'], callback)
);

export const onMouseMove = (callback: Callback): EventListenerClean => (
  eventListener(window, ['mousemove', 'touchmove'], callback)
);
