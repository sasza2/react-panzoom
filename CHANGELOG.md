# @sasza/react-panzoom

## 1.20.0

### Minor Changes

- 5bcaae7: feat: update panzoom-core to 1.10.0, add onContainerPressStart/onContainerPressEnd events

## 1.19.2

### Patch Changes

- ee8af3a: fix: expose disabledMoveHorizontal/disabledMoveVertical on Element

## 1.19.1

### Patch Changes

- bc22e36: fix: prevent crash on first pinch-zoom tick, expose vertical resize options in Element wrapper touchEventToZoomInit can return null before enough touch data is collected; useZoom's wheelFunc dereferenced it without a guard. Also passes resizableVertical, resizedMinWidth/MaxWidth, resizedMinHeight/MaxHeight, resizerWidth/Height through the stories' Element wrapper, and adds an elementResize story to exercise horizontal, vertical, and combined resizing.

## 1.19.0

### Minor Changes

- 2a95398: feat: z-index property option on element

## 1.18.2

### Patch Changes

- d5d34b7: fix: update panzoom-core (fix ipad problem with scroll)

## 1.18.1

### Patch Changes

- e04c8ab: fix setting property in panzoom-core api

## 1.18.0

### Minor Changes

- 50b9f78: api new method - goBackToBoundary() - move component to containers boundary (for e.g. when container size has changed)

## 1.17.0

### Minor Changes

- 62c2dda: export types and ref changes

## 1.16.0

### Minor Changes

- 8f4d412: Support progressive rendering in PanZoomWithCover

## 1.15.0

### Minor Changes

- cbe8e1a: element disabledMove prop

## 1.14.0

### Minor Changes

- b647212: zoom position feature

## 1.13.0

### Minor Changes

- 25045ae: add class name to panzoom div container when any action like grabbing, moving element, resizing element is performing
