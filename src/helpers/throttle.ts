type Callback = (...args: Array<unknown>) => void

type Throttle = (cb: Callback, limit: number) => Callback & { cancel: () => void }

const throttle: Throttle = (cb, limit) => {
  let wait = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const func = (...args: Array<unknown>) => {
    if (wait) return;

    cb(...args);
    wait = true;
    timer = setTimeout(() => { wait = false; }, limit);
  };

  func.cancel = () => {
    clearTimeout(timer);
  };

  return func;
};

export default throttle;
