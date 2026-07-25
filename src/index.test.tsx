import { expect, it } from 'vitest';

import PanZoom, { Element, PanZoomWithCover } from './index';

it('exports PanZoom, Element and PanZoomWithCover', () => {
  expect(PanZoom).toBeDefined();
  expect(Element).toBeTypeOf('function');
  expect(PanZoomWithCover).toBeDefined();
});
