import { Elements, Position } from 'types'
import produceStyle from 'helpers/produceStyle'

type GetElements = ({ elementsRef }: { elementsRef: Elements }) => () => Elements['current']

export const getElements: GetElements = ({ elementsRef }) => () => elementsRef.current;

type UpdateElementPosition = ({ elementsRef }: { elementsRef: Elements })
  => (id: string | number, position: Position) => void

export const updateElementPosition: UpdateElementPosition = ({ elementsRef }) => (id, position) => {
  const element = elementsRef.current[id as string]
  if (!element) return

  element.node.current.style.transform = produceStyle({ position })
  element.position = position
}
