import React, { useCallback, useLayoutEffect, useState } from 'react';
import { withKnobs, select, number } from '@storybook/addon-knobs'

import PanZoom, { Element } from '..';

export default {
  title: 'PanZoom',
  decorators: [withKnobs],
};

export const rectangles = () => (
  <div style={{
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid green',
    width: number('container width', 2500),
    marginTop: number('margin top', 200),
    marginBottom: number('margin bottom', 2000),
    marginLeft: number('margin left', 200),
    marginRight: number('margin right', 250),
    height: number('container height', 400),
  }}
  >
    <style dangerouslySetInnerHTML={{ __html: `
      .react-panzoom__in {
        background-color: ${select('background', ['white', 'orange'])}
      }
    ` }}
    />
    <PanZoom width={number('width', 2900)} height={number('height', 2000)}>
      <Element id="a" family="aaa" x={50} y={90}>
        <div style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
        }}
        >
          111
        </div>
      </Element>
      <Element id="b" family="aaa" x={210} y={60}>
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
      <Element id="c" followers={['a', 'b']} x={310} y={160} draggableSelector='.drag-me'>
        <div style={{
          width: 120,
          height: 70,
          backgroundColor: 'green',
          color: '#fff',
        }}
        >
          333 <span className='drag-me' style={{ color: 'red', cursor: 'move' }}>here</span>
        </div>
      </Element>
      <Element id="d" x={300} y={260}>
        <div style={{
          width: 120,
          height: 70,
          backgroundColor: 'violet',
          color: '#fff',
        }}
        >
          444
        </div>
      </Element>
    </PanZoom>
  </div>
);

export const loremIpsum = () => (
  <div style={{ height: 200 }}>
    <PanZoom disabledUserSelect>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mauris elit, semper id cursus ut, dictum non dolor.
      Sed sagittis ultricies dui id maximus. Donec nunc tortor, iaculis ut elementum sit amet, pharetra ut odio.
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
      boundary={{}}
      width={2000}
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
          height={5000}
          width={5000}
          selecting={selecting}
        >
          <Element id="orange" x={30} y={30}>
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
