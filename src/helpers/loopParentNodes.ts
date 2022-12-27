const loopParentNodes = <T extends HTMLElement>(node: T) => {
  type Callback = (current: T) => void
  type Stop = (current: T) => boolean

  const loop = (cb: Callback, stop?: Stop) => {
    for (
      let currentNode = node;
      !!currentNode === true;
      currentNode = currentNode.parentNode as T
    ) {
      if (stop && stop(currentNode)) break;
      cb(currentNode);
    }
  };

  return {
    forEachToWindow: (cb: Callback) => {
      loop(cb);
    },
    forEach: (cb: Callback) => {
      loop(cb, (currentNode: T) => currentNode === document.body);
    },
  };
};

export default loopParentNodes;
