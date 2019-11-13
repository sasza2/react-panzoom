import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './context'
import useMove from './hooks/useMove'
import useZoom from './hooks/useZoom'

const PanZoom = ({ children }) => {
  const wrapperRef = useRef()
  const pos = useMove(wrapperRef)
  const zoom = useZoom(wrapperRef)  

  const wrapperStyle = {
    'display': 'inline-block',
    'overflow': 'hidden',
    'transform': `scale(${zoom})`,
    'transform-origin': '0 0',
  }

  const childrenStyle = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
  }

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div style={childrenStyle}>
        {children}
      </div>
    </div>
  )
}

PanZoom.propTypes = {
  children: PropTypes.node.isRequired,
}

const PanZoomWithContext = (props) => (
  <PanZoomContext>
    <PanZoom {...props} />
  </PanZoomContext>
)

export default PanZoomWithContext
