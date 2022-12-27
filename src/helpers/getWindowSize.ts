import getBoundingClientRect from './getBoundingClientRect';

type Size = {
  width: number,
  height: number,
}

const getWindowSize = (): Size => {
  const bodyRect = getBoundingClientRect(document.body);
  return {
    width: Math.min(bodyRect.width, window.innerWidth),
    height: Math.min(bodyRect.height, window.innerHeight),
  };
};

export default getWindowSize;
