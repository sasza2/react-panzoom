import React, { useCallback, useLayoutEffect, useState } from 'react';

import PanZoom, { Element } from '..';

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
        <Element id="a" x={50} y={90}>
          <div style={{
            width: 100,
            height: 100,
            backgroundColor: 'red',
          }}
          >
            111
          </div>
        </Element>
        <Element id="b" x={210} top={260}>
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
    <PanZoom disabledUserSelect>
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

export const boxBounding = () => (
  <div style={{ border: '1px dashed #000', width: 400, height: 400 }}>
    <PanZoom
      disabledUserSelect
      boundary={{
        parent: true,
      }}
      height={5000}
      width={5000}
    >
      <Element id="orange">
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
          <span>move me</span>
        </div>
      </Element>
      <Element id="red" x={100} y={150}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            backgroundColor: 'red',
            fontSize: 14,
          }}
        >
          <span>or me</span>
        </div>
      </Element>
    </PanZoom>
  </div>
);

export const selectingBoxes = () => {
  const [selecting, setSelecting] = useState(true);

  const toggle = useCallback(
    (e) => setSelecting(e.target.checked),
    [selecting],
  );

  return (
    <>
      <label htmlFor="selecting">
        Selecting mode
        <input id="selecting" type="checkbox" onChange={toggle} checked={selecting} />
      </label>
      <div style={{ border: '1px dashed #000', width: 400, height: 400 }}>
        <PanZoom
          disabledUserSelect
          boundary={{
            parent: true,
          }}
          height={5000}
          width={5000}
          selecting={selecting}
        >
          <Element id="orange">
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
              <span>move me</span>
            </div>
          </Element>
          <Element id="red" x={100} y={150}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                backgroundColor: 'red',
                fontSize: 14,
              }}
            >
              <span>or me</span>
            </div>
          </Element>
          <Element id="green" x={200} y={50}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                width: 100,
                height: 160,
                backgroundColor: 'green',
                fontSize: 14,
              }}
            >
              <span>hello world</span>
            </div>
          </Element>
        </PanZoom>
      </div>
    </>
  );
};
