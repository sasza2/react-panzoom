const produceBoundingElement = ({
  element, container, x, y, zoom,
}) => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const maxRight = (containerRect.width - elementRect.width) / zoom;
  const maxBottom = (containerRect.height - elementRect.height) / zoom;

  const position = {};

  if (x < 0) position.x = 0;
  else if (x > maxRight) position.x = maxRight;
  else position.x = x;

  if (y < 0) position.y = 0;
  else if (y > maxBottom) position.y = maxBottom;
  else position.y = y;

  return position;
};

export default produceBoundingElement;
