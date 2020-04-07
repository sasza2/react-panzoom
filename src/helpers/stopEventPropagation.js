const stopEventPropagation = () => {
  const cb = () => {
    cb.prevent = true;
  };
  cb.prevent = false;
  return cb;
};

export default stopEventPropagation;
