import { Element, Elements, ElementsInMove, OnElementsChange, Position } from 'types'
import produceStyle from 'helpers/produceStyle'

type FindMin = () => ((currentPositionValue: number, nextPositionValue: number) => void) & { value: number }

type UpdateFamilyOfElementsPositionProps = {
  elementsRef: Elements,
  elementsInMove: ElementsInMove,
  produceNextPosition: (from: Position, currentElement: Element) => Position
  onElementsChange?: OnElementsChange,
}

type UpdateFamilyOfElementsPosition = (props: UpdateFamilyOfElementsPositionProps) => void

const updateFamilyOfElementsPosition: UpdateFamilyOfElementsPosition = ({
  elementsRef,
  elementsInMove,
  onElementsChange,
  produceNextPosition,
}) => {
  const elementsChange: ElementsInMove = {}

  const findMinDiffBetweenPositions: FindMin = () => {
    let value: number | null = null
    const func = (currentPositionValue: number, nextPositionValue: number) => {
      if (value === null || Math.abs(currentPositionValue - nextPositionValue) < Math.abs(value)) {
        func.value = value = currentPositionValue - nextPositionValue
      }
    }
    func.value = value
    return func
  }

  const xMinFind = findMinDiffBetweenPositions()
  const yMinFind = findMinDiffBetweenPositions()

  Object.entries(elementsInMove).forEach(([currentElementId, from]) => {
    const currentElement = elementsRef.current[currentElementId];

    const position = produceNextPosition(from, currentElement);

    xMinFind(currentElement.position.x, position.x)
    yMinFind(currentElement.position.y, position.y)
  });

  Object.entries(elementsInMove).forEach(([currentElementId]) => {
    const currentElement = elementsRef.current[currentElementId];

    const position: Position = {
      x: currentElement.position.x - xMinFind.value,
      y: currentElement.position.y - yMinFind.value,
    }

    elementsChange[currentElementId] = position;

    currentElement.position = position
    currentElement.node.current.style.transform = produceStyle({ position });
  })

  if (onElementsChange) onElementsChange(elementsChange);
}

export default updateFamilyOfElementsPosition
