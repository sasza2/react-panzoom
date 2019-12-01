import { createRef } from 'react';

import move from './move';

test('api/move', () => {
  const childRef = createRef();
  childRef.current = { style: {} };

  const positionRef = createRef();
  positionRef.current = { x: 250, y: 400 };

  const zoomRef = createRef();
  zoomRef.current = 1.1;

  // Move (40, -30)
  move({ childRef, positionRef, zoomRef })(40, -30);

  expect(childRef.current.style.transform).toBe('translate(290px, 370px) scale(1.1)');
  expect(positionRef.current).toStrictEqual({ x: 290, y: 370 });
  expect(zoomRef.current).toBe(1.1);

  // Move (-120, 60)
  move({ childRef, positionRef, zoomRef })(-120, 60);

  expect(childRef.current.style.transform).toBe('translate(170px, 430px) scale(1.1)');
  expect(positionRef.current).toStrictEqual({ x: 170, y: 430 });
  expect(zoomRef.current).toBe(1.1);
});
