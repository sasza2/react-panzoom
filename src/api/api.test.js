import { createRef } from 'react';

import api from './api';

test('api', () => {
  const apiRef = createRef();
  const childRef = createRef();
  const positionRef = createRef();
  const zoomRef = createRef();

  api({
    apiRef,
    childRef,
    positionRef,
    zoomRef,
  });

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

  expect(Object.keys(apiRef.current)).toStrictEqual(list);
});
