import { MutableRefObject } from 'react'

import { Position, Zoom } from 'types'
import produceStyle from 'helpers/produceStyle'
import { distanceToRightEdge, distanceToBottomEdge } from 'helpers/isEdgeVisible'

const hasScroll = (node: HTMLDivElement) => node.clientHeight < node.scrollHeight

const moveScroll = (
  childRef: MutableRefObject<HTMLDivElement>,
  nextX: number,
  nextY: number,
): Position => {
  const parent = childRef.current.parentNode as HTMLDivElement
  let node = parent.parentNode as HTMLDivElement
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect()

  const toAdd = {
    x: nextX,
    y: nextY,
  }

  const blockHorizontal = parentRect.right > 0 && parentRect.right < window.innerWidth && toAdd.x < 0
  const blockVertical = parentRect.bottom > 0 && parentRect.bottom < window.innerHeight && toAdd.y < 0

  if (blockHorizontal && blockVertical) return toAdd

  while (node) {
    if (hasScroll(node)) {
      if (!blockHorizontal) {
        const currentScrollLeft = node.scrollLeft || 0
        node.scrollLeft -= toAdd.x
        toAdd.x += (node.scrollLeft || 0) - currentScrollLeft
      }

      if (!blockVertical) {
        const currentScrollTop = node.scrollTop || 0
        node.scrollTop -= toAdd.y
        toAdd.y += (node.scrollTop || 0) - currentScrollTop
      }
    }

    node = node.parentNode as HTMLDivElement
  }

  return toAdd
}

type AppendToCurrentPositionProps = {
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
  addPosition: Position,
  zoomRef: Zoom,
}

const appendToCurrentPosition = ({
  childRef,
  positionRef,
  addPosition,
  zoomRef,
}: AppendToCurrentPositionProps): void => {
  const toAdd = moveScroll(childRef, addPosition.x, addPosition.y)

  positionRef.current = {
    x: positionRef.current.x + toAdd.x,
    y: positionRef.current.y + toAdd.y,
  }

  if (toAdd.x || toAdd.y) {
    if (positionRef.current.x > 0) positionRef.current.x = 0
    if (positionRef.current.y > 0) positionRef.current.y = 0

    const diffX = distanceToRightEdge(childRef, positionRef)
    if (diffX < 0) positionRef.current.x -= diffX

    const diffY = distanceToBottomEdge(childRef, positionRef)
    if (diffY < 0) positionRef.current.y -= diffY
  }

  childRef.current.style.transform = produceStyle({
    position: positionRef.current,
    zoom: zoomRef.current,
  });
}

export default appendToCurrentPosition
