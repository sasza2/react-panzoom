import React, { useEffect, useState } from 'react';

import PanZoom, { Element } from '..';

export default { title: 'Scroll' };

export const Scroll = () => {
  const [disabledScrollHorizontal, setDisabledScrollHorizontal] = useState(true);
  const [disabledZoom, setDisabledZoom] = useState(true);

  useEffect(() => {
    const toggle = (e: KeyboardEvent, value: boolean) => {
      if (e.code === 'ShiftLeft') {
        setDisabledScrollHorizontal(value);
        setDisabledZoom(true);
      } else if (e.code === 'ControlLeft') {
        setDisabledZoom(value);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      toggle(e, false);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      toggle(e, true);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <PanZoom
      disabledMove
      disabledScrollHorizontal={!disabledZoom || disabledScrollHorizontal}
      disabledScrollVertical={!disabledZoom || !disabledScrollHorizontal}
      disabledZoom={disabledZoom}
    >
      <span>abc</span>
      <Element id="test" x={50} y={50}>
        moveable
      </Element>
    </PanZoom>
  );
};
