const isEventMobileZoom = (event: MouseEvent | TouchEvent): boolean => {
  if ('touches' in event) return event.touches.length > 1
  return false
}

export default isEventMobileZoom
