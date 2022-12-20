import { expect, it } from 'vitest';

import produceStyle from './produceStyle';

it('helpers/produceStyle', () => {
  expect(produceStyle({ position: { x: 30, y: 50 }, zoom: 1.1 })).toBe(
    'translate(30px, 50px) scale(1.1)'
  );
  expect(produceStyle({ position: { x: -15, y: 9 }, zoom: 0.5 })).toBe(
    'translate(-15px, 9px) scale(0.5)'
  );
});
