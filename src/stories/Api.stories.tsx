import React, { useRef } from 'react';

import { PanZoomApi } from 'types';
import PanZoom, { Element } from '..';

export default { title: 'API' };

type WriteToTextarea = (
  ref: React.MutableRefObject<HTMLTextAreaElement>
) => (value: object) => void;

export const API = () => {
  const panZoomRef = useRef<PanZoomApi>();
  const containerChangeRef = useRef<HTMLTextAreaElement>();
  const containerPositionChangeRef = useRef();
  const containerZoomChangeRef = useRef();
  const elementsChangeRef = useRef();

  const writeToTextarea: WriteToTextarea = (ref) => (value) => {
    const { current } = ref;
    current.value = JSON.stringify(value);
  };

  return (
    <div>
      <button type="button" onClick={() => panZoomRef.current.zoomIn(0.2)}>
        +
      </button>
      <button type="button" onClick={() => panZoomRef.current.zoomOut(0.2)}>
        -
      </button>
      <button type="button" onClick={() => panZoomRef.current.reset()}>
        reset
      </button>
      <button type="button" onClick={() => panZoomRef.current.move(-20, 0)}>
        &lt;-
      </button>
      <button type="button" onClick={() => panZoomRef.current.move(20, 0)}>
        -&gt;
      </button>
      <div style={{ height: 200 }}>
        <PanZoom
          ref={panZoomRef}
          onContainerChange={writeToTextarea(containerChangeRef)}
          onContainerPositionChange={writeToTextarea(containerPositionChangeRef)}
          onContainerZoomChange={writeToTextarea(containerZoomChangeRef)}
          onElementsChange={writeToTextarea(elementsChangeRef)}
        >
          <span>abc</span>
          <Element id="test" x={50} y={50}>
            moveable
          </Element>
        </PanZoom>
      </div>
      <div>
        <p>onContainerChange</p>
        <textarea ref={containerChangeRef} />
      </div>
      <div>
        <p>onContainerPositionChange</p>
        <textarea ref={containerPositionChangeRef} />
      </div>
      <div>
        <p>onContainerZoomChange</p>
        <textarea ref={containerZoomChangeRef} />
      </div>
      <div>
        <p>onElementsChange</p>
        <textarea ref={elementsChangeRef} />
      </div>
    </div>
  );
};
