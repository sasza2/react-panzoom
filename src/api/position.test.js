import { createRef } from 'react';

import { getPosition, setPosition } from './position';

test('api/position/get', () => {
  const positionRef = createRef();

  positionRef.current = { x: 30, y: 40 };
  expect(getPosition({ positionRef })()).toStrictEqual({ x: 30, y: 40 });

  positionRef.current = { x: 60, y: 25 };
  expect(getPosition({ positionRef })()).toStrictEqual({ x: 60, y: 25 });
});

test('api/position/set', () => {
  const childRef = createRef();
  childRef.current = { style: {} };

  const positionRef = createRef();
  positionRef.current = { x: 250, y: 400 };

  const zoomRef = createRef();
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
