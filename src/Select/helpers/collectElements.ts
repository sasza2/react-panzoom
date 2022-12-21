import { Boundary, Element, Elements } from 'types';

type ElementsInBoundary = Record<string, Element>;

const collectElements = (boundary: Boundary, elements: Elements['current']): ElementsInBoundary => {
  const elementsInBoundary: ElementsInBoundary = {};

  Object.entries(elements).forEach(([id, element]) => {
    if (
      element.position.x >= boundary.left
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
