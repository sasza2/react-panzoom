import React, { useCallback, useLayoutEffect, useState } from 'react';
import type { Story } from '@ladle/react';

import { API } from 'types';
import PanZoom, { Element } from '..';

export default {
  title: 'PanZoom',
};

export const rectangles: Story<{
  width: number;
  height: number;
  containerWidth: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  containerHeight: number;
  background: string;
}> = ({
  width,
  height,
  containerWidth,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  containerHeight,
  background,
}) => (
  <div
    style={{
      display: 'inline-block',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid green',
      width: containerWidth,
      height: containerHeight,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
    }}
  >
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
      .react-panzoom__in {
        background-color: ${background}
      }
    `,
      }}
    />
    <PanZoom width={width} height={height}>
      <Element id="a" family="aaa" x={50} y={90}>
        <div
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'red',
          }}
        >
          111
        </div>
      </Element>
      <Element id="b" family="aaa" x={210} y={60}>
        <div
          style={{
            width: 40,
            height: 170,
            backgroundColor: 'blue',
            color: '#fff',
          }}
        >
          222
        </div>
      </Element>
      <Element
        id="c"
        followers={['a', 'b']}
        x={310}
        y={160}
        draggableSelector=".drag-me"
      >
        <div
          style={{
            width: 120,
            height: 70,
            backgroundColor: 'green',
            color: '#fff',
          }}
        >
          333
          {' '}
          <span className="drag-me" style={{ color: 'red', cursor: 'move' }}>
            here
          </span>
        </div>
      </Element>
      <Element id="d" x={300} y={260}>
        <div
          style={{
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
rectangles.args = {
  width: 2900,
  height: 2000,
  containerWidth: 2500,
  marginTop: 200,
  marginBottom: 2000,
  marginLeft: 200,
  marginRight: 250,
  containerHeight: 400,
};
rectangles.argTypes = {
  background: {
    options: ['white', 'orange'],
    control: { type: 'radio' },
    defaultValue: 'white',
  },
};

export const loremIpsum = () => (
  <div style={{ height: 200 }}>
    <PanZoom disabledUserSelect>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mauris elit,
      semper id cursus ut, dictum non dolor. Sed sagittis ultricies dui id
      maximus. Donec nunc tortor, iaculis ut elementum sit amet, pharetra ut
      odio.
    </PanZoom>
  </div>
);

export const imageSVG = () => (
  <div style={{ border: '1px solid red' }}>
    <PanZoom>
      <svg height="210" width="500">
        <polygon
          points="200,10 250,190 160,210"
          style={{ fill: 'lime', stroke: 'purple', strokeWidth: 1 }}
        />
      </svg>
    </PanZoom>
  </div>
);

export const imageSVGAnimation = () => {
  const ref = React.createRef<API>();
  useLayoutEffect(() => {
    const timer = setInterval(() => {
      ref.current.setPosition(120, Math.floor(Math.random() * 240 - 120));
    }, 500);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ border: '1px solid red' }}>
      <PanZoom ref={ref}>
        <svg height="210" width="500">
          <polygon
            points="200,10 250,190 160,210"
            style={{ fill: 'lime', stroke: 'purple', strokeWidth: 1 }}
          />
        </svg>
      </PanZoom>
    </div>
  );
};

export const boxBounding = () => (
  <div style={{ border: '1px dashed #000', width: 400, height: 400 }}>
    <PanZoom disabledUserSelect boundary width={2000}>
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

  const toggle = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => setSelecting(e.target.checked),
    [selecting],
  );

  return (
    <>
      <label htmlFor="selecting">
        Selecting mode
        <input
          id="selecting"
          type="checkbox"
          onChange={toggle}
          checked={selecting}
        />
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
