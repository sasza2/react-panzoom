import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';
import { expect, it, vi, afterEach } from 'vitest';

import PanZoomWithCover from './PanZoomWithCover';
import { PanZoomApi } from 'types';

class MockImage {
  naturalWidth = 800;

  naturalHeight = 600;

  src = '';

  addEventListener() {}

  removeEventListener() {}
}

class MockImageLoadedViaEvent {
  naturalWidth = 0;

  naturalHeight = 0;

  src = '';

  listeners: Record<string, () => void> = {};

  addEventListener(event: string, cb: () => void) {
    this.listeners[event] = cb;
  }

  removeEventListener() {}
}

afterEach(() => {
  vi.useRealTimers();
});

it('PanZoomWithCover initializes once the image reports its size', async () => {
  vi.stubGlobal('Image', MockImage);
  vi.useFakeTimers();

  const onCoverLoad = vi.fn();
  const panZoomRef = createRef<PanZoomApi>();

  const { container, unmount } = render(
    <PanZoomWithCover cover="cover.png" onCoverLoad={onCoverLoad} ref={panZoomRef}>
      <div>content</div>
    </PanZoomWithCover>
  );

  await act(() => vi.advanceTimersByTimeAsync(100));

  expect(onCoverLoad).toHaveBeenCalled();
  expect(container.textContent).toBe('content');
  expect(panZoomRef.current.getZoom()).toBeDefined();

  unmount();
  vi.unstubAllGlobals();
});

it('PanZoomWithCover initializes via the image load event', async () => {
  const imageInstances: Array<MockImageLoadedViaEvent> = [];
  class TrackedMockImage extends MockImageLoadedViaEvent {
    constructor() {
      super();
      imageInstances.push(this);
    }
  }
  vi.stubGlobal('Image', TrackedMockImage);
  vi.useFakeTimers();

  const onCoverLoad = vi.fn();

  render(
    <PanZoomWithCover cover="cover.png" onCoverLoad={onCoverLoad}>
      <div>content</div>
    </PanZoomWithCover>
  );

  imageInstances[0].naturalWidth = 800;
  imageInstances[0].naturalHeight = 600;
  await act(() => {
    imageInstances[0].listeners.load();
    // attachImageToDom is idempotent: a second call (e.g. interval firing right after) must be a no-op
    imageInstances[0].listeners.load();
    return vi.advanceTimersByTimeAsync(0);
  });

  expect(onCoverLoad).toHaveBeenCalledTimes(1);
  vi.unstubAllGlobals();
});

it('PanZoomWithCover cleans up when the cover changes before load', () => {
  vi.stubGlobal('Image', MockImage);

  const { rerender, unmount } = render(
    <PanZoomWithCover cover="a.png">
      <div>content</div>
    </PanZoomWithCover>
  );

  rerender(
    <PanZoomWithCover cover="b.png">
      <div>content</div>
    </PanZoomWithCover>
  );

  expect(() => unmount()).not.toThrow();
  vi.unstubAllGlobals();
});
