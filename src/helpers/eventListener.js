const eventListener = (node, eventNames, callback) => {
  eventNames.forEach((eventName) => {
    node.addEventListener(eventName, callback);
  });

  return () => {
    eventNames.forEach((eventName) => {
      node.removeEventListener(eventName, callback);
    });
  };
};

export const onMouseDown = (node, callback) => (
  eventListener(node, ['mousedown', 'touchstart'], callback)
);

export const onMouseUp = (node, callback) => (
  eventListener(node, ['mouseup', 'touchend'], callback)
);

export const onMouseMove = (node, callback) => (
  eventListener(node, ['movemouse', 'touchmove'], callback)
);
