import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import PanZoomContext, { usePanZoom } from './context'
import { transform } from './helpers/produceStyle'
import useMove from './hooks/useMove'
import useZoom from './hooks/useZoom'

const PanZoom = ({ children }) => {
  const childRef = useRef()
  const position = useMove(childRef)
  const zoom = useZoom(childRef)
  const { origin } = usePanZoom()
  console.log(origin)

  const wrapperStyle = {
    display: 'inline-block',
    overflow: 'hidden',
  }

  const childStyle = {
    transform: transform({ position, zoom }),
    transformOrigin: `${origin.x}px ${origin.y}px`,
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
