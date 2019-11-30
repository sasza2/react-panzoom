import positionClone from './positionClone';

test('helpers/positionClone', () => {
  const positionRef = {
    current: { x: 50, y: 100 },
  };
  expect(positionClone(positionRef)).toStrictEqual({ x: 50, y: 100 });
});
