type StopEventPropagation = () => (() => void) & { done: boolean };

const stopEventPropagation: StopEventPropagation = () => {
  const cb = () => {
    cb.done = true;
  };
  cb.done = false;
  return cb;
};

export default stopEventPropagation;
