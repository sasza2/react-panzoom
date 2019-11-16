import React from 'react'

import PanZoom from './PanZoom'

export default { title: 'PanZoom' }

export const rectangles = () => (
  <div style={{ display: 'inline-block', border: '1px solid green' }}>
    <PanZoom>
      <div style={{ width: 500, height: 400 }}>
        <div style={{ 
          position: 'absolute',
          left: 50,
          top: 90,
          width: 100,
          height: 100,
          backgroundColor: 'red'
        }}>
          111
        </div>
        <div style={{ 
          position: 'absolute',
          left: 210,
          top: 260,
          width: 40,
          height: 170,
          backgroundColor: 'blue',
          color: '#fff',
        }}>
          222
        </div>
      </div>
    </PanZoom>
  </div>
)

export const text = () => <PanZoom>abc</PanZoom>

export const textRectangle = () => (
  <PanZoom>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200, height: 200 }}>
      <span>abc</span>
    </div>
  </PanZoom>
)
