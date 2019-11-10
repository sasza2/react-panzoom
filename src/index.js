import React from 'react'
import PropTypes from 'prop-types'

const PanZoom = ({ children }) => (
  <div>
    {children}
  </div>
)

PanZoom.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PanZoom
