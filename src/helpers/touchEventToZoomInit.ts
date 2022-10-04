import { ZoomEvent } from 'types'

const calculateTouchPointsArea = (touches: TouchList) => {
  if (touches.length === 2) {
    const x = Math.abs(touches.item(0).clientX - touches.item(1).clientX)
    const y = Math.abs(touches.item(0).clientY - touches.item(1).clientY)
    return Math.sqrt(x * x + y * y)
  }
  let total = 0;
  for (let i = 0; i < touches.length; i++) {
    const addX = touches.item(i).clientX;
    const addY = touches.item(i === touches.length - 1 ? 0 : i + 1).clientY
    const subX = touches.item(i === touches.length - 1 ? 0 : i + 1).clientX
    const subY = touches.item(i).clientY
    total += (addX * addY * 0.5) - (subX * subY * 0.5);
  }
  return Math.abs(total);
}

type TouchEventToZoomInit = () => [(e: TouchEvent) => ZoomEvent, () => void]

const touchEventToZoomInit: TouchEventToZoomInit = () => {
  let lastArea: number | null = null

  const transform = (e: TouchEvent): ZoomEvent => {
    if (e.touches.length  < 2) return null

    e.preventDefault()
    e.stopPropagation()

    let clientX = 0, clientY = 0
    for (let i = 0; i < e.touches.length; i++) {
      clientX += e.touches.item(i).clientX
      clientY += e.touches.item(i).clientY
    }

    clientX /= e.touches.length
    clientY /= e.touches.length

    const currentArea = calculateTouchPointsArea(e.touches)
    if (lastArea === null || Math.round(currentArea) === Math.round(lastArea)) {
      lastArea = currentArea
      return {
        deltaY: 0,
        clientX,
        clientY,
      }
    }

    const deltaY = currentArea > lastArea ? -1 : 1
    lastArea = currentArea


    return {
      deltaY,
      clientX,
      clientY,
    } as WheelEvent
  }

  const reset = () => {
    lastArea = null
  }

  return [transform, reset]
}

export default touchEventToZoomInit
