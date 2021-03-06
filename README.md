# @sasza/react-panzoom
React component for pan and zoom with possibility to moving and selecting elements inside.

!["Preview"](docs/preview.gif "Example preview")

# Demo
https://codesandbox.io/s/goofy-rgb-48tbu

# Installation
```npm install @sasza/react-panzoom```

# Properties

| Name | | Default | Description |
| --- | --- | --- | --- |
| boundary | { top, right, bottom left, parent } | {} | **top, right, bottom, left** - numbers in px.<br />**parent** - bool, if set to true child's wrapper width and height are added to boundary |
| children __*__ | node  |||
| disabledUserSelect | bool | false | prevent css select as text etc |
| disabled | bool | false | disabling pan and zoom |
| disabledElements | bool | false | disabling moving elements |
| disabledMove | bool | false | disabling move |
| disabledZoom | bool | false | disabling zoom |
| height | string/number | 100% | height of child container |
| onContainerChange | func | null | event on move/zoom |
| onContainerClick | func | null | event on mousedown/touchdown |
| onContainerPositionChange | func | null | event on position change |
| onContainerZoomChange | func | null | event on zoom change |
| onElementsChange | func | null | callback invoked when elements change position |
| selecting | bool | false | switches to selecting mode, see `selecting` |
| width | string/number | 100% | width of child container |
| zoomMax | number | null | maximum zoom |
| zoomMin | number | 0.1 | minimum zoom |
| zoomSpeed | number | 1 | zoom speed on wheel event |
| zoomStep | number | 0.05 | zoom accuracy |

__*__ - is required

# API
```jsx
const panZoomRef = createRef()
// ...
return (
  <PanZoom ref={panZoomRef}>
    ...
  </PanZoom>
)
```

panZoomRef.current contains methods like:

| Function | Description |
| --- | --- |
| move(x:**number**, y:**number**) | Add x and y in px to current offset. Returns current position {x, y} |
| getElements() | Returns map of elements |
| getPosition() | Returns current position {x, y} |
| setPosition(x:**number**, y:**number**) | Set offset position of pan |
| getZoom():**number** | Returns current zoom |
| setZoom(zoom:**number**) | Sets zoom |
| zoomIn(zoom:**number**) | Add to current zoom, could be also negative number (it will work like zoomOut) |
| zoomOut(zoom:**number**) | Sub from current zoom |
| ref() | Returns node element |
| reset() | Reset to (0, 0, 0) |

# Elements

!["Preview"](docs/figures.gif "Figures")

```jsx
import PanZoom, { Element } from '@sasza/react-panzoom'

// ...

<div style={{ width: 300, height: 300 }}>
  <PanZoom>
    <Element id="orange" x={50} y={60}>
      <Circle />
    </Element>
    <Element id="red" x={120} y={150}>
      <Square />
    </Element>
  </PanZoom>
</div>
```

## Element properties

| Name | | Default | Description |
| --- | --- | --- | --- |
| id * | string/id | undefined | Unique ID of element |
| children __*__ | node  |||
| disabled | bool  | false | Disabling element |
| onClick | func | null | event on element's click |
| x | number  | 0 | x position of element |
| y | number  | 0 | y position of element |

# Selecting

```jsx
import PanZoom, { Element } from '@sasza/react-panzoom'

// ...

<div style={{ width: 300, height: 300 }}>
  <PanZoom selecting>
    <Element id="orange" x={50} y={60}>
      <Circle />
    </Element>
    <Element id="red" x={120} y={150}>
      <Square />
    </Element>
    <Element id="green" x={200} y={50}>
      <SquareRounded />
    </Element>
  </PanZoom>
</div>
```

!["Preview"](docs/selecting.gif "Selecting elements")

# Testing
```
npm run test
```

# Examples
```
npm run storybook
```

# Usage
```javascript
import PanZoom from "@sasza/react-panzoom";

const App = () => (
  <PanZoom>
    Lorem ipsum dolor
  </PanZoom>
)
```