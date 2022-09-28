import throttle from './throttle';

test('helpers/produceStyle', () => {
  let result = 0
  const func = (a, b) => {
    result += a + b
  }

  const sum = throttle(func, 200)
  sum(200, 100)
  sum(300, 200)
  sum(50, 50)

  expect(result).toBe(300)

  setTimeout(() => {
    sum(100, 100)
    sum(200, 200)
    expect(result).toBe(500)
  }, 300)
});
