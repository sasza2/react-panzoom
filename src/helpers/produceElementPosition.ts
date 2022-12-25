import { Position } from 'types';

type ProduceElementPositionProps = {
  element: HTMLElement;
  container: HTMLDivElement;
  x: number;
  y: number;
  zoom: number;
};

const produceElementPosition = ({
  element,
  container,
  x,
  y,
  zoom,
}: ProduceElementPositionProps): Position => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const maxRight = (containerRect.width - elementRect.width) / zoom;
  const maxBottom = (containerRect.height - elementRect.height) / zoom;

  const position: Position = { x, y };

  if (position.x < 0) position.x = 0;
  else if (position.x > maxRight) position.x = maxRight;

  if (position.y < 0) position.y = 0;
  else if (position.y > maxBottom) position.y = maxBottom;

  return position;
};

export default produceElementPosition;
