const maxParamValue = ({ boundary, rect, value, type, zoom }) => {
  const max = rect[type] * boundary * zoom
  if (value > 0 && value > max) return max
  else if (value < 0 && value < -max) return -max
  return value
}

export const produceBounding = ({ boundaryHorizontal, boundaryVertical, x, y, rect, zoom, }) => {
  const nextPosition = { x, y }
  if (boundaryVertical){    
    nextPosition.y = maxParamValue({
      boundary: boundaryVertical,
      rect,
      value: y,
      type: 'height',
      zoom,
    })
  }
  if (boundaryHorizontal){
    nextPosition.x = maxParamValue({
      boundary: boundaryHorizontal,
      rect,
      value: x,
      type: 'width',
      zoom,
    })
  }

  return nextPosition
}
