import { createRef } from 'react';

import reset from './reset';

test('api/reset', () => {
  const childRef = createRef();
  childRef.current = { style: {} };
  const positionRef = createRef();
  const zoomRef = createRef();

  reset({ childRef, positionRef, zoomRef })();

  expect(childRef.current.style.transform).toBe('translate(0px, 0px) scale(1)');
  expect(positionRef.current).toStrictEqual({ x: 0, y: 0 });
  expect(zoomRef.current).toBe(1);
});
