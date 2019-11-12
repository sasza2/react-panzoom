import React, { useState } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext from './PanZoomContext'

const PanZoomProvider = ({ children }) => {
  const [zoom, setZoom] = useState(1.0)
  const [position, setPosition] = useState({})

  return (
    <PanZoomContext.Provider value={{ zoom, setZoom, position, setPosition }}>
      {children}
    </PanZoomContext.Provider>
  )
}

PanZoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PanZoomProvider