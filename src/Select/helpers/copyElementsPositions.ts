import { Elements, Position } from 'types'

const copyElementsPositions = (elements: Elements['current']): Record<string, Position> => {
  const positions: Record<string, Position> = {};
  Object.entries(elements).forEach(([id, element]) => {
    positions[id] = { ...element.position };
  });
  return positions;
};

export default copyElementsPositions;
