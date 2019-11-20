import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './PanZoomContext'

const PanZoomProvider = ({
  children,
  ...props
}) => {
  const zoomRef = useRef()
  const positionRef = useRef()

  if (!zoomRef.current) zoomRef.current = 1
  if (!positionRef.current) positionRef.current = { x: 0, y: 0 }

  return (
    <PanZoomContext.Provider
      value={{
        positionRef,
        zoomRef,
        ...props
      }}>
      {children}
    </PanZoomContext.Provider>
  )
}

PanZoomProvider.propTypes = {
  boundaryVertical: PropTypes.number,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  disabledMove: PropTypes.bool,
  disabledZoom: PropTypes.bool,
  onPositionChange: PropTypes.func,
  onZoomChange: PropTypes.func,
  zoomMax: PropTypes.number,
  zoomMin: PropTypes.number,
  zoomSpeed: PropTypes.number,
  zoomStep: PropTypes.number,
}

PanZoomProvider.defaultProps = {
  disabled: false,
  disabledMove: false,
  disabledZoom: false,
  zoomMin: 0.1,
  zoomSpeed: 1,
  zoomStep: 0.05,
}

export default PanZoomProvider