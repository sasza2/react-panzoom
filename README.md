# react-panzoom
React component for pan and zoom with possibility to moving elements inside.

!["Preview"](docs/preview.gif "Example preview")

# Demo
https://codesandbox.io/s/goofy-rgb-48tbu

# Installation
```npm install react-panzoom```

# Properties

| Name | | Default | Description |
| --- | --- | --- | --- |
| boundary | { top, right, bottom left, parent } | {} | **top, right, bottom, left** - numbers in px.<br />**parent** - bool, if set to true child's wrapper width and height are added to boundary |
| children __*__ | node  |||
| disableUserSelect | bool | false | prevent css select as text etc |
| disabled | bool | false | disabling pan and zoom |
| disabledElements | bool | false | disabling moving elements |
| disabledMove | bool | false | disabling move |
| disabledZoom | bool | false | disabling zoom |
| elementsInterval | number | 250 | interval for executing `onElementsChange` |
| onChange | func | null | event on move/zoom |
| onElementsChange | func | null | callback invoked when elements change position |
| onPositionChange | func | null | event on position change |
| onZoomChange | func | null | event on zoom change |
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
| x | number  | 0 | x position of element |
| y | number  | 0 | y position of element |

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