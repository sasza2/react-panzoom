import React from 'react';
import { render } from '@testing-library/react';

import PanZoom from '../PanZoom';

test('api', () => {
  const panZoomRef = {
    current: null,
  };

  render(
    <PanZoom ref={panZoomRef}>
      <div>...</div>
    </PanZoom>,
  );

  const list = [
    'move',
    'getPosition',
    'setPosition',
    'getZoom',
    'setZoom',
    'zoomIn',
    'zoomOut',
    'reset',
  ];

  expect(Object.keys(panZoomRef.current)).toStrictEqual(list);
});
