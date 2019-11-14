export const transform = ({ position, zoom }) => {
  return `translate(${position.x}px, ${position.y}px) scale(${zoom})`
}
