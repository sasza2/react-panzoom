import { createRef } from 'react';

import { getZoom } from './zoom';

test('api/zoom/get', () => {
  const zoomRef = createRef();

  zoomRef.current = 1.1;
  expect(getZoom({ zoomRef })()).toBe(1.1);

  zoomRef.current = 0.5;
  expect(getZoom({ zoomRef })()).toBe(0.5);
});
