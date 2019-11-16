import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './PanZoomContext'

const PanZoomProvider = ({ children }) => {
  const zoomRef = useRef()
  const positionRef = useRef()

  if (!zoomRef.current) zoomRef.current = 1
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 }

  return (
    <PanZoomContext.Provider
      value={{
        positionRef,
        zoomRef,
      }}>
      {children}
    </PanZoomContext.Provider>
  )
}

PanZoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PanZoomProvider