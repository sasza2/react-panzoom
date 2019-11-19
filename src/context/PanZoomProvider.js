import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './PanZoomContext'

const PanZoomProvider = ({
  children,
  disabled,
  zoomMax,
  zoomMin,
  zoomSpeed,
  zoomStep
}) => {
  const zoomRef = useRef()
  const positionRef = useRef()

  if (!zoomRef.current) zoomRef.current = 1
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 }

  return (
    <PanZoomContext.Provider
      value={{
        disabled,
        positionRef,
        zoomMax,
        zoomMin,
        zoomRef,
        zoomSpeed,
        zoomStep,
      }}>
      {children}
    </PanZoomContext.Provider>
  )
}

PanZoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  zoomMax: PropTypes.number,
  zoomMin: PropTypes.number,
  zoomSpeed: PropTypes.number,
  zoomStep: PropTypes.number,
}

PanZoomProvider.defaultProps = {
  disabled: false,
  zoomMin: 0.1,
  zoomSpeed: 1,
  zoomStep: 0.05,
}

export default PanZoomProvider