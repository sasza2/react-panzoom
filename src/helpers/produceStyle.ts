import { Position } from 'types';

type TransformProps = {
  position: Position,
  zoom?: number,
}

const transform = ({ position, zoom }: TransformProps): string => {
  if (zoom) return `translate(${position.x}px, ${position.y}px) scale(${zoom})`;
  return `translate(${position.x}px, ${position.y}px)`;
};

export default transform;
