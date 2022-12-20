import React, { useEffect, useRef, useState } from 'react';

import { API, Position, Size } from 'types';
import { PanZoomWithCover, Element } from '..';
import styles from './Cover.module.css';

export default {
  title: 'Cover',
};

const PINS_INITIAL = {
  pin1: { x: 313, y: 181 },
  pin2: { x: 1463, y: 323 },
};
const PIN_SIZE = 48; // px
const PIN_HALF_WIDTH = PIN_SIZE / 2;
const PIXEL_TO_METER = 3.794;
const DISTANCE_THROTTLE_TIMEOUT = 200; // ms

const Pin = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.pin}
  >
    <path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602" />
  </svg>
);

export const cover = () => {
  const [distance, setDistance] = useState<number>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout>(null);
  const panZoomRef = useRef<API>();
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [line, setLine] = useState<React.SVGAttributes<SVGLineElement>>();
  const [elements, setElements] = useState(PINS_INITIAL);

  useEffect(() => {
    if (timer) return;

    setTimer(setTimeout(() => {
      setTimer(null);

      const { pin1, pin2 } = elements;

      const a = Math.abs(pin1.x - pin2.x);
      const b = Math.abs(pin1.y - pin2.y);

      setDistance(Math.sqrt(a * a + b * b) * PIXEL_TO_METER);
    }, DISTANCE_THROTTLE_TIMEOUT));
  }, [elements]);

  useEffect(() => {
    const { width, height } = panZoomRef.current.ref().current.getBoundingClientRect();
    setSize({ width, height });
  }, [panZoomRef.current]);

  useEffect(() => {
    if (!panZoomRef.current) return;
    const zoom = panZoomRef.current.getZoom();
    const { pin1, pin2 } = elements;

    setLine({
      x1: zoom * (pin1.x + PIN_HALF_WIDTH),
      y1: zoom * (pin1.y + PIN_SIZE),
      x2: zoom * (pin2.x + PIN_HALF_WIDTH),
      y2: zoom * (pin2.y + PIN_SIZE),
    });
  }, [panZoomRef.current, elements]);

  const onElementsChange = (els: Record<string, Position>) => {
    setElements((prevElements) => ({ ...prevElements, ...els }));
  };

  return (
    <>
      <div>
        Distance: ~
        {distance}
        m
      </div>
      <div style={{ width: 400, height: 500 }}>
        <PanZoomWithCover
          apiRef={panZoomRef}
          cover="https://raw.githubusercontent.com/sasza2/react-panzoom/master/docs/openstreetmap.jpg"
          onElementsChange={onElementsChange}
        >
          <Element id="authors">
            map authors ©
            {' '}
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
          </Element>
          <Element
            className="pin"
            id="pin1"
            x={PINS_INITIAL.pin1.x}
            y={PINS_INITIAL.pin1.y}
          >
            <Pin />
          </Element>
          <Element
            className="pin"
            id="pin2"
            x={PINS_INITIAL.pin2.x}
            y={PINS_INITIAL.pin2.y}
          >
            <Pin />
          </Element>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size.width} ${size.height}`}>
            <line
              {...line}
              stroke="black"
              strokeDasharray="4 4 4"
              strokeWidth="2"
            />
          </svg>
        </PanZoomWithCover>
      </div>
    </>
  );
};
