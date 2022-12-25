import { MutableRefObject, createRef } from 'react';
import { expect, it } from 'vitest';

import reset from './reset';
import { Position, Zoom } from 'types';

it('api/reset', () => {
  const childRef = createRef() as MutableRefObject<HTMLDivElement>;
  childRef.current = { style: {} } as HTMLDivElement;
  const positionRef = createRef() as MutableRefObject<Position>;
  const zoomRef = createRef() as Zoom;

  reset({ childRef, positionRef, zoomRef })();

  expect(childRef.current.style.transform).toBe('translate(0px, 0px) scale(1)');
  expect(positionRef.current).toStrictEqual({ x: 0, y: 0 });
  expect(zoomRef.current).toBe(1);
});
