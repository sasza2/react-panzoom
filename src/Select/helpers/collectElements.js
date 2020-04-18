const collectElements = (boundary, elements) => {
  const elementsInBoundary = {};

  Object.entries(elements).forEach(([id, element]) => {
    if (element.position.x >= boundary.left
      && element.position.x <= boundary.right
      && element.position.y >= boundary.top
      && element.position.y <= boundary.bottom
    ) {
      elementsInBoundary[id] = element;
    }
  });

  return elementsInBoundary;
};

export default collectElements;
