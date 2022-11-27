import React, { useCallback, useLayoutEffect, useState } from 'react';
import { withKnobs, select, number } from '@storybook/addon-knobs'

import PanZoomWithCover from '../WithCover';

export default {
  title: 'Cover',
  decorators: [withKnobs],
};

export const loremIpsum = () => (
  <div style={{ width: 400, height: 500 }}>
    <PanZoomWithCover cover={'https://images.unsplash.com/photo-1669158424156-01778fcc6427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1012&q=80'}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mauris elit, semper id cursus ut, dictum non dolor.
      Sed sagittis ultricies dui id maximus. Donec nunc tortor, iaculis ut elementum sit amet, pharetra ut odio.
    </PanZoomWithCover>
  </div>
);
