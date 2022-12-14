import { ClientPosition } from 'types';

const positionFromEvent = (e: TouchEvent | MouseEvent): ClientPosition => {
  const { touches } = e as TouchEvent;
  if (touches) {
    return {
      clientX: touches[0].clientX,
      clientY: touches[0].clientY,
    };
  }

  const mouseEvent = e as MouseEvent;
  return {
    clientX: mouseEvent.clientX,
    clientY: mouseEvent.clientY,
  };
};

export default positionFromEvent;
