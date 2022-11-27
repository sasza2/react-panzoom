import { ReactNode, RefObject, MutableRefObject } from 'react'

type Edge = string | number

export type Boundary = {
  top?: Edge,
  right?: Edge,
  bottom?: Edge,
  left?: Edge,
}

export type BoundaryProp = Boundary | boolean

export type Position = {
  x: number,
  y: number,
}

export type ElementId = string | number

export type Element = {
  family?: string,
  id: ElementId,
  node: RefObject<HTMLDivElement>,
  position: Position,
}

export type Elements = MutableRefObject<Record<ElementId, Element>>

export type Zoom = MutableRefObject<number>

export type ZoomEvent = {
  deltaY: number,
  clientX: number,
  clientY: number,
}

export type ElementsInMove = Record<ElementId, Position>

export type ClientPosition = {
  clientX: number,
  clientY: number,
}

export type OnElementsChange = (elements: Record<string, Position>) => unknown

type OnContainerChange = ({ position, zoom }: { position: Position, zoom: number }) => unknown

type PanZoomCommon = {
  apiRef?: MutableRefObject<API>,
  boundary?: BoundaryProp,
  className?: string,
  disabled?: boolean,
  disabledElements?: boolean,
  disabledMove?: boolean,
  disabledUserSelect?: boolean,
  disabledZoom?: boolean,
  onElementsChange?: OnElementsChange,
  onContainerChange?: OnContainerChange,
  onContainerClick?: (
    click: {
      e: MouseEvent,
      stop: () => unknown,
    } & Position
  ) => unknown,
  onContainerPositionChange?: OnContainerChange,
  onContainerZoomChange?: OnContainerChange,
  selecting?: boolean,
  zoomInitial?: number,
  zoomMax?: number,
  zoomMin?: number,
  zoomSpeed?: number,
}

export type PanZoomProps = PanZoomCommon & Size

export type Size = {
  height?: string | number,
  width?: string | number,
}

export type API = {
  move: (x: number, y: number) => void,
  getElements: () => Elements['current'],
  updateElementPosition: (id: string | number, position: Position) => void,
  getPosition: () => Position,
  setPosition: (position: Position) => void,
  getZoom: () => number,
  setZoom: (zoom: number) => void,
  zoomIn: (zoom: number) => void,
  zoomOut: (zoom: number) => void,
  ref: () => MutableRefObject<HTMLDivElement>,
  reset: () => void,
}

type ElementOnClick = (props: {
  id: ElementId,
  family?: string,
  e: MouseEvent,
  stop: () => void,
} & Position) => unknown

type ElementOnMouseUp = (props: {
  id: ElementId,
  family?: string,
  e: MouseEvent,
} & Position) => unknown

export type ElementProps = {
  children: ReactNode,
  className?: string,
  disabled?: boolean,
  draggableSelector?: string,
  family?: string,
  followers?: Array<ElementId>,
  id: ElementId,
  onClick?: ElementOnClick,
  onMouseUp?: ElementOnMouseUp,
  x: number,
  y: number,
}

export type PanZoomDefaultProps = {
  children: ReactNode,
} & PanZoomProps
