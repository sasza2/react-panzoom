import React, { useRef } from 'react';

import { PanZoomApi } from 'types';
import PanZoom from '..';

export default { title: 'Map' };

export const Map = () => {
  const panZoomRef = useRef<PanZoomApi>();

  const changeZoom = (addToCurrent: number) => {
    const position = panZoomRef.current.getPosition();
    const parentNode = panZoomRef.current.childNode.parentNode as HTMLDivElement;
    const parentRect = parentNode.getBoundingClientRect();
    const currentZoom = panZoomRef.current.getZoom();

    const centerX = parentRect.width / 2
    const centerY = parentRect.height / 2
  
    const xOffset = (centerX - parentRect.left - position.x) / currentZoom;
    const yOffset = (centerY - parentRect.top - position.y) / currentZoom;

    panZoomRef.current.setZoom(currentZoom + addToCurrent)

    const nextZoom = panZoomRef.current.getZoom();

    panZoomRef.current.setPosition(
      centerX - parentRect.left - xOffset * nextZoom,
      centerY - parentRect.top - yOffset * nextZoom,
    )
  }

  return (
    <div>
      <button type="button" onClick={() => changeZoom(0.2)}>
        zoom in
      </button>
      <button type="button" onClick={() => changeZoom(-0.2)}>
        zoom out
      </button>
      <div style={{ height: 400, border: '1px solid black' }}>
        <PanZoom ref={panZoomRef} zoomMax={10}>
          <img src='https://cdn.britannica.com/37/245037-004-AFE9084C/world-map-continents-oceans.jpg' />
        </PanZoom>
      </div>
    </div>
  );
};
