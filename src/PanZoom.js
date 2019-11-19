import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './context'
import useMove from './hooks/useMove'
import useZoom from './hooks/useZoom'

/*
  TODO props:
  - ref (setZoom, setPosition, reset),
  - boundaryVertical,
  - boundaryHorizontal,
  - preventSelection,
  - onChange,
  - onZoomChange,
  - onPositionChange,
  - <Moveable />
*/
const PanZoom = ({ children, className }) => {
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
    <div className={className} style={wrapperStyle}>
      <div className={className && `${className}__in`} ref={childRef} style={childStyle}>
        {children}
      </div>
    </div>
  )
}

PanZoom.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

PanZoom.defaultProps = {
  className: null,
}

const PanZoomWithContext = (props) => (
  <PanZoomContext {...props}>
    <PanZoom {...props} />
  </PanZoomContext>
)

export default PanZoomWithContext
