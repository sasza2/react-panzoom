import { Elements } from 'types'

type GetElements = ({ elementsRef }: { elementsRef: Elements }) => () => Elements['current']

const getElements: GetElements = ({ elementsRef }) => () => elementsRef.current;

export default getElements;
