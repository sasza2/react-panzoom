import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './context'
import useZoom from './hooks/useZoom'

const PanZoom = ({ children }) => {
  const wrapperRef = useRef()
  useZoom(wrapperRef)

  return (
    <div ref={wrapperRef}>
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
