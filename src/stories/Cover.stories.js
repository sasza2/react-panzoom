import React, { useCallback, useLayoutEffect, useState } from 'react';
import { withKnobs, select, number } from '@storybook/addon-knobs'

import { PanZoomWithCover, Element } from '..';

export default {
  title: 'Cover',
  decorators: [withKnobs],
};

export const loremIpsum = () => (
  <div style={{ width: 400, height: 500 }}>
    <PanZoomWithCover cover={'https://raw.githubusercontent.com/sasza2/react-panzoom/master/docs/openstreetmap.jpg'}>
      <Element id="authors">
        map authors © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
      </Element>
    </PanZoomWithCover>
  </div>
);
