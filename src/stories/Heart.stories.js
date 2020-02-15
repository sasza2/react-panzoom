import React, { useEffect, useRef, useState } from 'react';

import PanZoom, { Element } from '..';

export default { title: 'Heart' };

export const boxBounding = () => {
  const timeRef = useRef();
  const [connected, setConnected] = useState(false);
  const [puzzleExists, setPuzzleExists] = useState(true);

  useEffect(() => () => clearTimeout(timeRef.current), []);

  const onElementsChange = (elements) => {
    const { puzzle } = elements;
    if (puzzle.x >= 85 && puzzle.x <= 101 && puzzle.y >= 7 && puzzle.y <= 23) {
      setConnected(true);
      timeRef.current = setTimeout(() => {
        setPuzzleExists(false);
      }, 500);
    }
  };

  return (
    <div style={{ border: '1px dashed #000', width: 400, height: 400 }}>
      <PanZoom
        disableUserSelect
        onElementsChange={onElementsChange}
      >
        <Element id="heart">
          <img
            style={{
              opacity: connected ? 1 : 0.5,
              transition: 'all 1s',
            }}
            src={
              connected
                ? 'https://i.postimg.cc/ppnCv9Sf/heart-all.png'
                : 'https://i.postimg.cc/XrfgZR4X/heart-missing.png'
            }
            alt="heart missing"
          />
        </Element>
        {
          puzzleExists && (
            <Element id="puzzle" x={250} y={250}>
              <img style={{ width: 68 }} src="https://i.postimg.cc/gxFD2z9f/heart-puzzle.png" alt="puzzle" />
            </Element>
          )
        }
      </PanZoom>
    </div>
  );
};
