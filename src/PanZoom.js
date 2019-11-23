import React, { forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './context'
import useMove from './hooks/useMove'
import useZoom from './hooks/useZoom'
import api from './api'

/*
  TODO props:
  - ref (setZoom, setPosition, reset),
  - preventSelection,
  - onChange,
  - <Moveable />
*/
const PanZoom = ({ children, className, forwardRef }) => {
  const childRef = useRef()

  const positionRef = useMove(childRef)
  const zoomRef = useZoom(childRef)

  api({ forwardRef, positionRef, ref: childRef, zoomRef })

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
  forwardRef: PropTypes.object,
}

PanZoom.defaultProps = {
  className: null,
}

const PanZoomWithContext = (props, ref) => (
  <PanZoomContext {...props}>
    <PanZoom forwardRef={ref} {...props} />
  </PanZoomContext>
)

export default forwardRef(PanZoomWithContext)
