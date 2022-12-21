import { MutableRefObject, createRef } from 'react';
import { expect, it } from 'vitest';

import { getPosition, setPosition } from './position';
import { Position, Zoom } from 'types';

it('api/position/get', () => {
  const positionRef = createRef() as MutableRefObject<Position>;

  positionRef.current = { x: 30, y: 40 };
  expect(getPosition({ positionRef })()).toStrictEqual({ x: 30, y: 40 });

  positionRef.current = { x: 60, y: 25 };
  expect(getPosition({ positionRef })()).toStrictEqual({ x: 60, y: 25 });
});

it('api/position/set', () => {
  const childRef = createRef() as MutableRefObject<HTMLDivElement>;
  childRef.current = { style: {} } as HTMLDivElement;

  const positionRef = createRef() as MutableRefObject<Position>;
  positionRef.current = { x: 250, y: 400 };

  const zoomRef = createRef() as Zoom;
  zoomRef.current = 1.1;

  // To (200, 300)
  setPosition({ childRef, positionRef, zoomRef })(200, 300);

  expect(positionRef.current).toStrictEqual({ x: 200, y: 300 });
  expect(zoomRef.current).toBe(1.1);
  expect(childRef.current.style.transform).toBe('translate(200px, 300px) scale(1.1)');

  // To (600, 100)
  setPosition({ childRef, positionRef, zoomRef })(600, 100);

  expect(positionRef.current).toStrictEqual({ x: 600, y: 100 });
  expect(zoomRef.current).toBe(1.1);
  expect(childRef.current.style.transform).toBe('translate(600px, 100px) scale(1.1)');
});
