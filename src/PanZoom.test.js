import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';

import PanZoom from './PanZoom';

test('PanZoom move', () => {
  const { container } = render(
    <PanZoom>
      <div>abc</div>
    </PanZoom>,
  );

  fireEvent.mouseDown(container.firstChild, { clientX: 5, clientY: 10 });
  fireEvent.mouseMove(container.firstChild, { clientX: 150, clientY: 260 });
  fireEvent.mouseUp(container.firstChild);

  expect(container.firstChild.firstChild.style.transform).toBe('translate(145px, 250px) scale(1)');
});

test('PanZoom zoom', () => {
  const { container } = render(
    <PanZoom>
      <div>abc</div>
    </PanZoom>,
  );

  fireEvent.wheel(container.firstChild);

  expect(container.firstChild.firstChild.style.transform).toBe('translate(0px, 0px) scale(0.95)');
});
