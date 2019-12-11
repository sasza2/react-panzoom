# react-panzoom
React component for pan and zoom.

!["Preview"](docs/preview.gif "Example preview")

```javascript
(
  <PanZoom>
    {children}
  </PanZoom>
)
```

# Installation
```npm install react-panzoom```

# Properties

| Name | | Default | Description |
| --- | --- | --- | --- |
| boundary | { top, right, bottom left, parent } | {} | **top, right, bottom, left** - numbers in px.<br />**parent** - bool, if set to true child's wrapper width and height are added to boundary |
| children __*__ | node  |||
| disabled | bool | false | disabling pan and zoom |
| disabledMove | bool | false | disabling move |
| disabledZoom | bool | false | disabling zoom |
| onChange | func | null | event on move/zoom |
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
| getPosition() | Returns current position {x, y} |
| setPosition(x:**number**, y:**number**) | Set offset position of pan |
| getPosition():**number** | Returns current zoom |
| setZoom(zoom:**number**) | Sets zoom |
| zoomIn(zoom:**number**) | Add to current zoom, could be also negative number (it will work like zoomOut) |
| zoomOut(zoom:**number**) | Sub from current zoom |
| reset() | Reset to (0, 0, 0) |

# Testing
```
npm run test
```

# Examples
```
npm run storybook
```