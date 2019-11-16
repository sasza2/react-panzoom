import { useContext } from 'react'

import PanZoomContext from './PanZoomContext'

const useUrlSync = () => {
  const { positionRef, zoomRef } = useContext(PanZoomContext)

  return {
    positionRef,
    zoomRef,
  }
}

export default useUrlSync