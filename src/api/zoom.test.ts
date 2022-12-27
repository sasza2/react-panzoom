import { MutableRefObject, createRef } from 'react';
import { expect, it } from 'vitest';

import { getZoom, setZoom, zoomIn, zoomOut } from './zoom';
import { Position, Zoom } from 'types';

it('api/zoom/get', () => {
  const zoomRef = createRef() as Zoom;

  zoomRef.current = 1.1;
  expect(getZoom({ zoomRef })()).toBe(1.1);

  zoomRef.current = 0.5;
  expect(getZoom({ zoomRef })()).toBe(0.5);
});

it('api/zoom/set', () => {
  const childRef = createRef() as MutableRefObject<HTMLDivElement>;
  childRef.current = { style: {} } as HTMLDivElement;

  const positionRef = createRef() as MutableRefObject<Position>;
  const zoomRef = createRef() as Zoom;

  // Change to 1.5
  positionRef.current = { x: 15, y: 30 };
  setZoom({ childRef, positionRef, zoomRef })(1.5);

  expect(childRef.current.style.transform).toBe('translate(15px, 30px) scale(1.5)');
  expect(positionRef.current).toStrictEqual({ x: 15, y: 30 });
  expect(zoomRef.current).toBe(1.5);

  // Change to 2.1
  setZoom({ childRef, positionRef, zoomRef })(2.1);

  expect(childRef.current.style.transform).toBe('translate(15px, 30px) scale(2.1)');
  expect(positionRef.current).toStrictEqual({ x: 15, y: 30 });
  expect(zoomRef.current).toBe(2.1);
});

it('api/zoom/in', () => {
  const childRef = createRef() as MutableRefObject<HTMLDivElement>;
  childRef.current = { style: {} } as HTMLDivElement;

  const positionRef = createRef() as MutableRefObject<Position>;
  const zoomRef = createRef() as Zoom;
  zoomRef.current = 1;

  positionRef.current = { x: 20, y: 40 };
  zoomIn({ childRef, positionRef, zoomRef })(0.2);

  expect(childRef.current.style.transform).toBe('translate(20px, 40px) scale(1.2)');
  expect(positionRef.current).toStrictEqual({ x: 20, y: 40 });
  expect(zoomRef.current).toBe(1.2);

  zoomIn({ childRef, positionRef, zoomRef })(0.3);

  expect(childRef.current.style.transform).toBe('translate(20px, 40px) scale(1.5)');
  expect(positionRef.current).toStrictEqual({ x: 20, y: 40 });
  expect(zoomRef.current).toBe(1.5);
});

it('api/zoom/out', () => {
  const childRef = createRef() as MutableRefObject<HTMLDivElement>;
  childRef.current = { style: {} } as HTMLDivElement;

  const positionRef = createRef() as MutableRefObject<Position>;
  const zoomRef = createRef() as Zoom;
  zoomRef.current = 1.5;

  positionRef.current = { x: 20, y: 40 };
  zoomOut({ childRef, positionRef, zoomRef })(0.2);

  expect(childRef.current.style.transform).toBe('translate(20px, 40px) scale(1.3)');
  expect(positionRef.current).toStrictEqual({ x: 20, y: 40 });
  expect(zoomRef.current).toBe(1.3);

  zoomOut({ childRef, positionRef, zoomRef })(0.3);

  expect(childRef.current.style.transform).toBe('translate(20px, 40px) scale(1)');
  expect(positionRef.current).toStrictEqual({ x: 20, y: 40 });
  expect(zoomRef.current).toBe(1);
});
