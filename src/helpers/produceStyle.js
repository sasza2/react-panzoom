const transform = ({ position, zoom }) => {
  if (zoom) return `translate(${position.x}px, ${position.y}px) scale(${zoom})`;
  return `translate(${position.x}px, ${position.y}px)`;
};

export default transform;
