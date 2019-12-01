import { createRef } from 'react';

import { getPosition } from './position';

test('api/position/get', () => {
  const positionRef = createRef();

  positionRef.current = { x: 30, y: 40 };
  expect(getPosition({ positionRef })()).toStrictEqual({ x: 30, y: 40 });

  positionRef.current = { x: 60, y: 25 };
  expect(getPosition({ positionRef })()).toStrictEqual({ x: 60, y: 25 });
});
