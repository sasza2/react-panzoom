import produceBounding from './produceBounding';

test('helpers/produceBounding horizontal', () => {
  const boundary = { left: -200, right: 300 };

  expect(produceBounding({
    boundary,
    x: 400,
    y: 20,
    zoom: 1,
  })).toStrictEqual({ x: 300, y: 20 });

  expect(produceBounding({
    boundary,
    x: 200,
    y: 60,
    zoom: 1,
  })).toStrictEqual({ x: 200, y: 60 });

  expect(produceBounding({
    boundary,
    x: -150,
    y: 40,
    zoom: 1,
  })).toStrictEqual({ x: -150, y: 40 });

  expect(produceBounding({
    boundary,
    x: -300,
    y: 30,
    zoom: 1,
  })).toStrictEqual({ x: -200, y: 30 });

  expect(produceBounding({
    boundary,
    x: 700,
    y: 20,
    zoom: 2,
  })).toStrictEqual({ x: 600, y: 20 });

  expect(produceBounding({
    boundary,
    x: -200,
    y: 20,
    zoom: 0.5,
  })).toStrictEqual({ x: -100, y: 20 });
});

test('helpers/produceBounding vertical', () => {
  const boundary = { top: -200, bottom: 300 };

  expect(produceBounding({
    boundary,
    x: 400,
    y: 200,
    zoom: 1,
  })).toStrictEqual({ x: 400, y: 200 });

  expect(produceBounding({
    boundary,
    x: 200,
    y: 600,
    zoom: 1,
  })).toStrictEqual({ x: 200, y: 300 });

  expect(produceBounding({
    boundary,
    x: -150,
    y: -400,
    zoom: 1,
  })).toStrictEqual({ x: -150, y: -200 });

  expect(produceBounding({
    boundary,
    x: -300,
    y: 300,
    zoom: 1,
  })).toStrictEqual({ x: -300, y: 300 });

  expect(produceBounding({
    boundary,
    x: 700,
    y: 500,
    zoom: 2,
  })).toStrictEqual({ x: 700, y: 500 });

  expect(produceBounding({
    boundary,
    x: -200,
    y: -400,
    zoom: 0.5,
  })).toStrictEqual({ x: -200, y: -100 });
});

test('helpers/produceBounding vertical + horizontal', () => {
  const boundary = {
    left: 200,
    right: 400,
    top: -100,
    bottom: 300,
  };

  expect(produceBounding({
    boundary,
    x: 400,
    y: 200,
    zoom: 1,
  })).toStrictEqual({ x: 400, y: 200 });

  expect(produceBounding({
    boundary,
    x: 200,
    y: 600,
    zoom: 1,
  })).toStrictEqual({ x: 200, y: 300 });

  expect(produceBounding({
    boundary,
    x: -150,
    y: -400,
    zoom: 1,
  })).toStrictEqual({ x: 200, y: -100 });

  expect(produceBounding({
    boundary,
    x: -300,
    y: 300,
    zoom: 1,
  })).toStrictEqual({ x: 200, y: 300 });

  expect(produceBounding({
    boundary,
    x: 700,
    y: 500,
    zoom: 2,
  })).toStrictEqual({ x: 700, y: 500 });

  expect(produceBounding({
    boundary,
    x: -200,
    y: -400,
    zoom: 0.5,
  })).toStrictEqual({ x: 100, y: -50 });
});
