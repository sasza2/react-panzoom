import React, { useEffect, useRef, useState } from 'react';

import { PanZoomApi, OnElementsChange, Position } from 'types';
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
    className={styles.pin}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602" />
  </svg>
);

export const cover = () => {
  const [distance, setDistance] = useState<number>(null);
  const distanceThrottleRef = useRef<ReturnType<typeof setTimeout>>(null);
  const panZoomRef = useRef<PanZoomApi>();
  const svgLineRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const elementsRef = useRef(PINS_INITIAL);

  useEffect(() => () => {
    clearTimeout(distanceThrottleRef.current);
  }, []);

  const calculateDistance = () => {
    if (distanceThrottleRef.current) return;

    distanceThrottleRef.current = setTimeout(() => {
      const { pin1, pin2 } = elementsRef.current;
      const a = Math.abs(pin1.x - pin2.x);
      const b = Math.abs(pin1.y - pin2.y);

      setDistance(Math.sqrt(a * a + b * b) * PIXEL_TO_METER);

      distanceThrottleRef.current = null;
    }, DISTANCE_THROTTLE_TIMEOUT);
  };

  const updateViewBox = () => {
    const { width, height } = panZoomRef.current.childNode.getBoundingClientRect();
    svgLineRef.current.setAttribute('viewBox', `0 0 ${width} ${height}`);
  };

  const generateLinePoint = (position: Position) => {
    const zoom = panZoomRef.current.getZoom();
    return `${(position.x + PIN_HALF_WIDTH) * zoom} ${(position.y + PIN_SIZE) * zoom}`;
  };

  const updateLinePath = () => {
    const { pin1, pin2 } = elementsRef.current;
    const line = `M ${generateLinePoint(pin1)} ${generateLinePoint(pin2)}`;
    pathRef.current.setAttribute('d', line);
  };

  const onCoverLoad = () => {
    updateViewBox();
    updateLinePath();
    calculateDistance();
  };

  const onElementsChange: OnElementsChange = (elements) => {
    elementsRef.current = {
      ...elementsRef.current,
      ...elements,
    };

    updateViewBox();
    updateLinePath();
    calculateDistance();
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
          cover="https://raw.githubusercontent.com/sasza2/react-panzoom/master/docs/openstreetmap.jpg"
          onCoverLoad={onCoverLoad}
          onElementsChange={onElementsChange}
          ref={panZoomRef}
        >
          <Element id="authors">
            map authors ©
            {' '}
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
          </Element>
          <Element className="pin" id="pin1" x={PINS_INITIAL.pin1.x} y={PINS_INITIAL.pin1.y}>
            <Pin />
          </Element>
          <Element className="pin" id="pin2" x={PINS_INITIAL.pin2.x} y={PINS_INITIAL.pin2.y}>
            <Pin />
          </Element>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            ref={svgLineRef}
          >
            <path ref={pathRef} stroke="black" strokeDasharray="0 4 0" strokeWidth="calc(1/var(--zoom))" />
          </svg>
        </PanZoomWithCover>
      </div>
    </>
  );
};
