import { MutableRefObject } from 'react'

import { CURSOR_ON_EDGE_MARGIN } from 'consts'
import { ClientPosition } from 'types'

type Edges = {
  top: boolean,
  bottom: boolean,
  left: boolean,
  right: boolean,
}

const isCursorOnEdge = (childRef: MutableRefObject<HTMLDivElement>, e: ClientPosition): Edges => {
  const childRect = childRef.current.getBoundingClientRect()
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect()
  const offsetX = parentRect.left > 0 ? parentRect.left : 0
  const offsetY = parentRect.top > 0 ? parentRect.top : 0

  let startX = childRect.left - offsetX
  if (startX < 0) startX = 0

  let startY = childRect.top - offsetY
  if (startY < 0) startY = 0

  const endX = Math.min(
    window.innerWidth - offsetX,
    childRect.right,
    parentRect.right - CURSOR_ON_EDGE_MARGIN,
  )

  const endY = Math.min(
    window.innerHeight - offsetY,
    childRect.bottom,
    parentRect.bottom - CURSOR_ON_EDGE_MARGIN,
  )

  const mousePositionX = e.clientX - offsetX
  const mousePositionY = e.clientY - offsetY

  const edges = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  }

  if (startX + CURSOR_ON_EDGE_MARGIN > mousePositionX) edges.left = true
  else if(mousePositionX + CURSOR_ON_EDGE_MARGIN > endX) edges.right = true
  if (startY + CURSOR_ON_EDGE_MARGIN > mousePositionY) edges.top = true
  else if(mousePositionY + CURSOR_ON_EDGE_MARGIN > endY) edges.bottom = true

  return edges
}

export default isCursorOnEdge
