import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect, it } from 'vitest';

import PanZoom from './PanZoom';
import { API } from 'types';

it('PanZoom move', () => {
  const { container } = render(
    <PanZoom>
      <div>abc</div>
    </PanZoom>
  );

  fireEvent.mouseDown(container.firstChild, { clientX: 5, clientY: 10 });
  fireEvent.mouseMove(container.firstChild, { clientX: 150, clientY: 260 });
  fireEvent.mouseUp(container.firstChild);

  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(145px, 250px) scale(1)'
  );
});

it('PanZoom zoom', () => {
  const { container } = render(
    <PanZoom>
      <div>abc</div>
    </PanZoom>
  );

  fireEvent.wheel(container.firstChild);

  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(0px, 0px) scale(1)'
  );
});

it('PanZoom double zoom', () =>
  new Promise<void>((done) => {
    const panZoomRef = createRef<API>();
    const { container } = render(
      <PanZoom ref={panZoomRef}>
        <div>abc</div>
      </PanZoom>
    );

    fireEvent.wheel(container.firstChild);
    setTimeout(() => {
      fireEvent.wheel(container.firstChild);
      expect(Math.ceil(panZoomRef.current.getZoom() * 100)).toBe(100);
      done();
    }, 200);
  }));

it('PanZoom move on extra zoom', () => {
  const panZoomRef = createRef<API>();
  const { container } = render(
    <PanZoom ref={panZoomRef}>
      <div>abc</div>
    </PanZoom>
  );

  panZoomRef.current.setZoom(3);

  fireEvent.mouseDown(container.firstChild, { clientX: 5, clientY: 10 });
  fireEvent.mouseMove(container.firstChild, { clientX: 150, clientY: 260 });
  fireEvent.mouseUp(container.firstChild);

  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(145px, 250px) scale(3)'
  );
});

it('PanZoom move loop', () => {
  const { container } = render(
    <PanZoom>
      <div style={{ width: 200, height: 300 }}>abc</div>
    </PanZoom>
  );

  fireEvent.mouseDown(container.firstChild, { clientX: 5, clientY: 10 });
  for (let i = 0; i < 30; i += 1) {
    fireEvent.mouseMove(container.firstChild, {
      clientX: i * 20,
      clientY: i * 30,
    });
  }
  fireEvent.mouseUp(container.firstChild);

  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(575px, 860px) scale(1)'
  );
});

it('PanZoom boundary', () => {
  const { container } = render(
    <PanZoom
      boundary={{
        left: -100,
        top: -200,
        right: 300,
        bottom: 400,
      }}
    >
      <div style={{ width: 200, height: 300 }}>abc</div>
    </PanZoom>
  );

  fireEvent.mouseDown(container.firstChild, { clientX: 5, clientY: 10 });
  // Left
  fireEvent.mouseMove(container.firstChild, { clientX: -200, clientY: 100 });
  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(-100px, 90px) scale(1)'
  );
  // Right
  fireEvent.mouseMove(container.firstChild, { clientX: 400, clientY: 100 });
  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(300px, 90px) scale(1)'
  );
  // Top
  fireEvent.mouseMove(container.firstChild, { clientX: 400, clientY: -300 });
  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(300px, -200px) scale(1)'
  );
  // Bottom
  fireEvent.mouseMove(container.firstChild, { clientX: 400, clientY: 600 });
  expect((container.firstChild.firstChild as HTMLElement).style.transform).toBe(
    'translate(300px, 400px) scale(1)'
  );

  fireEvent.mouseUp(container.firstChild);
});
