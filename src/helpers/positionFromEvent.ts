type ClientPosition = {
  clientX: number,
  clientY: number,
}

const positionFromEvent = (e: TouchEvent & MouseEvent): ClientPosition => {
  const { touches } = e;
  if (touches) {
    return {
      clientX: touches[0].clientX,
      clientY: touches[0].clientY,
    };
  }

  return {
    clientX: e.clientX,
    clientY: e.clientY,
  };
};

export default positionFromEvent;
