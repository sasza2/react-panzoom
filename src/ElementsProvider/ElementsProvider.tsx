import React, {
  createContext, MutableRefObject, useContext, useRef, useState,
} from 'react';

import { ClientPosition, Elements, ElementsInMove } from 'types';
import useElementAutoMoveAtEdge from 'hooks/useElementAutoMoveAtEdge';

type ElementsContextProps = {
  elementsInMove: ElementsInMove,
  elementsRef: Elements,
  lastElementMouseMoveEventRef: MutableRefObject<ClientPosition>,
  setElementsInMove: (elementsInMove: ElementsInMove) => void,
}

const ElementsContext = createContext<ElementsContextProps>({} as ElementsContextProps);

export const useElements = (): ElementsContextProps => useContext(ElementsContext);

const ElementsAutoMove: React.FC = () => {
  useElementAutoMoveAtEdge();
  return null;
};

const Elements: React.FC = ({
  children,
}) => {
  const [elementsInMove, setElementsInMove] = useState<ElementsInMove>(null);
  const elementsRef: Elements = useRef({});
  const lastElementMouseMoveEventRef = useRef<ClientPosition>();

  return (
    <ElementsContext.Provider value={{
      elementsInMove,
      elementsRef,
      lastElementMouseMoveEventRef,
      setElementsInMove,
    }}
    >
      {children}
      <ElementsAutoMove />
    </ElementsContext.Provider>
  );
};

export default Elements;
