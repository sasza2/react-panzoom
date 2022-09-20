type StopEventPropagation = () => (() => void) & { prevent: boolean }

const stopEventPropagation: StopEventPropagation = () => {
  const cb = () => {
    cb.prevent = true;
  };
  cb.prevent = false;
  return cb;
};

export default stopEventPropagation;
