---
"@sasza/react-panzoom": patch
---

fix: prevent crash on first pinch-zoom tick, expose vertical resize options in Element wrapper touchEventToZoomInit can return null before enough touch data is collected; useZoom's wheelFunc dereferenced it without a guard. Also passes resizableVertical, resizedMinWidth/MaxWidth, resizedMinHeight/MaxHeight, resizerWidth/Height through the stories' Element wrapper, and adds an elementResize story to exercise horizontal, vertical, and combined resizing.
