export const produceBounding = ({ boundaryVertical, x, y, rect, zoom, }) => {
  const nextPosition = { x, y }
  if (boundaryVertical){    
    const maxHeight = rect.height * boundaryVertical * zoom
    console.log(y, -maxHeight, y < -maxHeight)
    if (y > 0 && y > maxHeight) nextPosition.y = maxHeight
    else if (y < 0 && y < -maxHeight) nextPosition.y = -maxHeight
  }

  return nextPosition
}
