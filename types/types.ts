import React from 'react';

export type API = {
  childNode: HTMLDivElement,
  move: (x: number, y: number) => void;
  getElements: () => Elements['current'];
  getElementsInMove: () => ElementsInMove,
  grabElement: (id: ElementId, position?: Position) => null | (() => void);
  updateElementPosition: (id: ElementId, position: Position) => void;
  updateElementPositionSilent: (id: ElementId, position: Position) => void;
  getPosition: () => Position;
  setPosition: (x: number, y: number) => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  zoomIn: (zoom: number) => void;
  zoomOut: (zoom: number) => void;
  reset: () => void;
};

export type Boundary = {
  top?: Edge;
  right?: Edge;
  bottom?: Edge;
  left?: Edge;
};

export type BoundaryProp = Boundary | boolean;

type Edge = string | number;

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  height?: string | number;
  width?: string | number;
};

export type Ref <T> = { current: T | undefined }

export type OnElementsChange = (elements: Record<string, Position>) => unknown;

type OnContainerChange = ({ position, zoom }: { position: Position; zoom: number }) => unknown;

type OnContainerClick = (
  click: {
    e: MouseEvent;
    stop: () => unknown;
  } & Position
) => unknown;

type OnContextMenu = (
  click: {
    e: MouseEvent;
  } & Position
) => unknown;

export type Zoom = Ref<number>;

export type ZoomPosition = {
  x?: number | 'center',
  y?: number | 'center',
}

export type PanZoomOptions = {
  boundary?: BoundaryProp;
  className?: string;
  disabled?: boolean;
  disabledElements?: boolean;
  disabledMove?: boolean;
  disabledScrollHorizontal?: boolean;
  disabledScrollVertical?: boolean;
  disabledUserSelect?: boolean;
  disabledZoom?: boolean;
  elementsAutoMoveAtEdge?: boolean;
  onContextMenu?: OnContextMenu;
  onElementsChange?: OnElementsChange;
  onContainerChange?: OnContainerChange;
  onContainerClick?: OnContainerClick,
  onContainerPositionChange?: OnContainerChange;
  onContainerZoomChange?: OnContainerChange;
  selecting?: boolean;
  scrollSpeed?: number,
  zoomInitial?: number;
  zoomMax?: number;
  zoomMin?: number;
  zoomPosition?: ZoomPosition | null;
  zoomSpeed?: number;
} & Size

export type PanZoomProps = React.PropsWithChildren<PanZoomOptions>

export type PanZoomPropsRef = PanZoomProps & { ref?: React.MutableRefObject<API> }

export type PanZoomWithCoverOmit = Omit<PanZoomOptions, 'boundary'>

export type PanZoomWithCoverProps = React.PropsWithChildren<{
  cover: string,
  onCoverLoad?: () => void,
} & PanZoomWithCoverOmit>

export type PanZoomWithCoverPropsRef = PanZoomWithCoverProps & {
  ref?: React.MutableRefObject<API>
}

export type PanZoomApi = {
  addElement: (node: HTMLDivElement, elementOptions: ElementOptions) => ElementApi,
  destroy: () => void,
  setOptions: (options: PanZoomOptions) => void,
} & API

export type ElementId = string | number;

export type Elements = Ref<Record<ElementId, Element>>;

export type ElementsInMove = Record<ElementId, Position>;

export type Element = {
  family?: string;
  id: ElementId;
  node: Ref<HTMLDivElement>;
  position: Position;
};

type ElementOnStartResizing = (
  props: {
    id: ElementId;
  }
) => unknown;

type ElementOnAfterResize = (
  props: {
    id: ElementId;
  }
) => unknown;

type ElementOnClick = (
  props: {
    id: ElementId;
    family?: string;
    e: MouseEvent;
    stop: () => void;
  } & Position
) => unknown;

type ElementOnMouseUp = (
  props: {
    id: ElementId;
    family?: string;
    e: MouseEvent;
  } & Position
) => unknown;

type ElementOnContextMenu = (
  props: {
    id: ElementId;
    family?: string;
    e: MouseEvent;
  } & Position
) => unknown;

export type ElementOptions = {
  className?: string;
  disabled?: boolean;
  disabledMove?: boolean;
  draggableSelector?: string;
  family?: string;
  followers?: Array<ElementId>;
  height?: number;
  id: ElementId;
  onAfterResize?: ElementOnAfterResize;
  onClick?: ElementOnClick;
  onContextMenu?: ElementOnContextMenu;
  onMouseUp?: ElementOnMouseUp;
  onStartResizing?: ElementOnStartResizing;
  resizable?: boolean;
  resizedMaxWidth?: number;
  resizedMinWidth?: number;
  resizerWidth?: number;
  width?: number;
  x?: number;
  y?: number;
};

export type ElementProps = React.PropsWithChildren<ElementOptions>

export type ElementApi = {
  destroy: () => void,
  setOptions: (options: ElementOptions) => void,
}
