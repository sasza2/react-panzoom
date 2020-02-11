import React, { useLayoutEffect } from 'react';

import PanZoom, { Element } from '.';

export default { title: 'PanZoom' };

export const rectangles = () => (
  <div style={{
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid green',
  }}
  >
    <PanZoom>
      <div style={{ width: 500, height: 400 }}>
        <Element x={50} y={90}>
          <div style={{
            width: 100,
            height: 100,
            backgroundColor: 'red',
          }}
          >
            111
          </div>
        </Element>
        <Element x={210} top={260}>
          <div style={{
            width: 40,
            height: 170,
            backgroundColor: 'blue',
            color: '#fff',
          }}
          >
            222
          </div>
        </Element>
      </div>
    </PanZoom>
  </div>
);

export const text = () => (
  <div style={{ height: 200 }}>
    <PanZoom disableUserSelect>
      abcdef
    </PanZoom>
  </div>
);

export const imageSVG = () => (
  <div style={{ border: '1px solid red' }}>
    <PanZoom>
      <svg height="210" width="500">
        <polygon points="200,10 250,190 160,210" style={{ fill: 'lime', stroke: 'purple', strokeWidth: 1 }} />
      </svg>
    </PanZoom>
  </div>
);

export const imageSVGAnimation = () => {
  const ref = React.createRef();
  useLayoutEffect(() => {
    const timer = setInterval(() => {
      ref.current.setPosition(120, parseInt(Math.random() * 240 - 120, 10));
    }, 500);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ border: '1px solid red' }}>
      <PanZoom ref={ref}>
        <svg height="210" width="500">
          <polygon points="200,10 250,190 160,210" style={{ fill: 'lime', stroke: 'purple', strokeWidth: 1 }} />
        </svg>
      </PanZoom>
    </div>
  );
};

export const API = () => {
  const panZoomRef = React.createRef();
  return (
    <div>
      <button type="button" onClick={() => panZoomRef.current.zoomIn(0.2)}>+</button>
      <button type="button" onClick={() => panZoomRef.current.zoomOut(0.2)}>-</button>
      <button type="button" onClick={() => panZoomRef.current.reset()}>reset</button>
      <button type="button" onClick={() => panZoomRef.current.move(-20, 0)}>&lt;-</button>
      <button type="button" onClick={() => panZoomRef.current.move(20, 0)}>-&gt;</button>
      <PanZoom ref={panZoomRef}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200, height: 200,
        }}
        >
          <span>abc</span>
        </div>
      </PanZoom>
    </div>
  );
};

export const boxBounding = () => {
  const panZoomRef = React.createRef();
  const innerRef = React.createRef();

  const onChange = ({ position, zoom }) => {
    innerRef.current.innerHTML = `${parseInt(position.x, 10)}:${parseInt(position.y, 10)} (${zoom.toFixed(2)}x)`;
  };

  return (
    <div style={{ border: '1px dashed #000', width: 400, height: 400 }}>
      <PanZoom
        boundary={{
          parent: true,
        }}
        disableUserSelect
        onChange={onChange}
        ref={panZoomRef}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 120,
            height: 120,
            backgroundColor: 'orange',
            fontSize: 14,
          }}
        >
          <span ref={innerRef}>move me</span>
        </div>
      </PanZoom>
    </div>
  );
};
