const VARIABLES_LIST = [
  'containerWidth',
  'containerHeight',
  'childWidth',
  'childHeight',
];

const lineToVariable = (
  str: string | number,
  variables: Record<string, number> = {},
): number => {
  if (typeof str === 'number') return str;
  if (!Number.isNaN(parseInt(str, 10))) return str as unknown as number;

  const numbers: Array<number> = [];
  const stack = [];
  let currentVariable = '';

  const parseNumber = (number: string) => {
    if (number.endsWith('px')) return parseInt(number.replace('px', ''), 10);
    return parseInt(number, 10);
  };

  const addVariableToNumbers = () => {
    if (VARIABLES_LIST.includes(currentVariable)) numbers.push(variables[currentVariable]);
    else numbers.push(parseNumber(currentVariable));
    currentVariable = '';
  };

  for (let i = 0; i < str.length; i++) {
    const current = str[i];
    switch (current) {
      case ' ':
        break;
      case '+':
      case '-': {
        addVariableToNumbers();
        stack.push(current);
        break;
      }
      default:
        currentVariable += current;
        break;
    }
  }

  addVariableToNumbers();

  while (stack.length) {
    const op = stack.shift();
    const a = numbers.shift() || 0;
    const b = numbers.shift() || 0;

    if (op === '+') numbers.unshift(a + b);
    else if (op === '-') numbers.unshift(a - b);
  }

  return numbers.pop();
};

export default lineToVariable;
