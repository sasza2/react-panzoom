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

export type Element = {
  family?: string,
  id: string | number,
  node: RefObject<HTMLDivElement>,
  position: Position,
}

export type Elements = MutableRefObject<Record<string, Element>>

export type Zoom = MutableRefObject<number>

export type ZoomEvent = {
  deltaY: number,
  clientX: number,
  clientY: number,
}

type OnContainerChange = ({ position, zoom }: { position: Position, zoom: number }) => unknown

export type PanZoomProviderProps = {
  apiRef?: MutableRefObject<API>,
  boundary?: BoundaryProp,
  disabled?: boolean,
  disabledElements?: boolean,
  disabledMove?: boolean,
  disabledUserSelect?: boolean,
  disabledZoom?: boolean,
  onElementsChange?: (elements: Record<string, Position>) => unknown,
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
  zoomMax?: number,
  zoomMin?: number,
  zoomSpeed?: number,
}

export type PanZoomProps = {
  children: ReactNode,
  className?: string,
  height?: string | number,
  width?: string | number,
} & PanZoomProviderProps

export type API = {
  move: (x: number, y: number) => void,
  getElements: () => Elements['current'],
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
  id: string | number,
  family?: string,
  e: MouseEvent,
  stop: () => void,
} & Position) => unknown

type ElementOnMouseUp = (props: {
  id: string | number,
  family?: string,
  e: MouseEvent,
} & Position) => unknown

export type ElementProps = {
  children: ReactNode,
  disabled?: boolean,
  draggableSelector?: string,
  family?: string,
  followers?: Array<string | number>,
  id: string | number,
  onClick?: ElementOnClick,
  onMouseUp?: ElementOnMouseUp,
  x: number,
  y: number,
}
