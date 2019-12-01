import { createRef } from 'react';

import {
  getZoom, setZoom, zoomIn, zoomOut,
} from './zoom';

test('api/zoom/get', () => {
  const zoomRef = createRef();

  zoomRef.current = 1.1;
  expect(getZoom({ zoomRef })()).toBe(1.1);

  zoomRef.current = 0.5;
  expect(getZoom({ zoomRef })()).toBe(0.5);
});

test('api/zoom/set', () => {
  const childRef = createRef();
  childRef.current = { style: {} };

  const positionRef = createRef();
  const zoomRef = createRef();

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

test('api/zoom/in', () => {
  const childRef = createRef();
  childRef.current = { style: {} };

  const positionRef = createRef();
  const zoomRef = createRef();
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

test('api/zoom/out', () => {
  const childRef = createRef();
  childRef.current = { style: {} };

  const positionRef = createRef();
  const zoomRef = createRef();
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
