import { MutableRefObject } from 'react'

import { Position } from 'types'
import getParentVisibleSize from './getParentVisibleSize'
import getScrollOffset from './getScrollOffset'

const isEdgeRightVisible = (childRef: MutableRefObject<HTMLDivElement>, positionRef: MutableRefObject<Position>): boolean => {
  const scroll = getScrollOffset(childRef)
  const childRect = childRef.current.getBoundingClientRect()
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect()
  const [visibleWidth] = getParentVisibleSize(childRef)

  const positionX = positionRef.current.x + childRect.width
  const parentMarginLeft = parentRect.left > 0 ? -scroll.x : document.body.getBoundingClientRect().left - parentRect.left

  return 0 < positionX + parentRect.left
    && positionX >= 0
    && positionX < visibleWidth + scroll.x + parentMarginLeft
}

const isEdgeBottomVisible = (childRef: MutableRefObject<HTMLDivElement>, positionRef: MutableRefObject<Position>): boolean => {
  const scroll = getScrollOffset(childRef)
  const childRect = childRef.current.getBoundingClientRect()
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect()
  const [, visibleHeight] = getParentVisibleSize(childRef)

  const positionY = positionRef.current.y + childRect.height
  const parentMarginTop = parentRect.top > 0 ? -scroll.y : document.body.getBoundingClientRect().top - parentRect.top

  return 0 < positionY + parentRect.top
    && positionY >= 0
    && positionY < visibleHeight + scroll.y + parentMarginTop
}


const isEdgeLeftVisible = (childRef: MutableRefObject<HTMLDivElement>, positionRef: MutableRefObject<Position>): boolean => {
  const scroll = getScrollOffset(childRef)
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect()
  const [visibleWidth] = getParentVisibleSize(childRef)

  return 0 < positionRef.current.x + parentRect.left
    && positionRef.current.x >= 0
    && positionRef.current.x < visibleWidth + scroll.x
}

const isEdgeTopVisible = (childRef: MutableRefObject<HTMLDivElement>, positionRef: MutableRefObject<Position>): boolean => {
  const scroll = getScrollOffset(childRef)
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect()
  const [, visibleHeight] = getParentVisibleSize(childRef)

  return 0 < positionRef.current.y + parentRect.top
    && positionRef.current.y >= 0
    && positionRef.current.y < visibleHeight + scroll.y
}

export default {
  left: isEdgeLeftVisible,
  right: isEdgeRightVisible,
  top: isEdgeTopVisible,
  bottom: isEdgeBottomVisible,
}
