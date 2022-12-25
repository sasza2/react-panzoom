import { MutableRefObject, createRef } from 'react';
import { expect, it } from 'vitest';

import move from './move';
import { Position, Zoom } from 'types';

it('api/move', () => {
  const childRef = createRef() as MutableRefObject<HTMLDivElement>;
  childRef.current = { style: {} } as HTMLDivElement;

  const positionRef = createRef() as MutableRefObject<Position>;
  positionRef.current = { x: 250, y: 400 };

  const zoomRef = createRef() as Zoom;
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
