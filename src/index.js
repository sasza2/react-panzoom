import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './context'
import useZoom from './hooks/useZoom'

const PanZoom = ({ children }) => {
  const wrapperRef = useRef()
  const zoom = useZoom(wrapperRef)

  const style = {
    'transform': `scale(${zoom})`,
    'transform-origin': '0 0',
  }

  return (
    <div ref={wrapperRef} style={style}>
      {children}
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
