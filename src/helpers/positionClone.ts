import { RefObject } from 'react'

import { Position } from 'types'

const positionClone = (positionRef: RefObject<Position>): Position => ({ ...positionRef.current });

export default positionClone;
