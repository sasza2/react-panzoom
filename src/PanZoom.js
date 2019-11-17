import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './context'
import useMove from './hooks/useMove'
import useZoom from './hooks/useZoom'

/*
  TODO props:
  - zoomSpeed,
  - disable,
  - disableZoom,
  - disableMove,
  - ref (setZoom, setPosition, reset),
  - minZoom,
  - maxZoom,
  - boundaryVertical,
  - boundaryHorizontal,
  - preventSelection,
  - onChange,
  - onZoomChange,
  - onPositionChange,
  - className,
*/
const PanZoom = ({ children }) => {
  const childRef = useRef()

  useMove(childRef)
  useZoom(childRef)

  const wrapperStyle = {
    overflow: 'hidden',
  }

  const childStyle = {
    transformOrigin: '0 0',
    pointerEvents: 'none',
  }

  return (
    <div style={wrapperStyle}>
      <div ref={childRef} style={childStyle}>
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
