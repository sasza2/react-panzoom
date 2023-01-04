import { createContext } from 'react';

import { PanZoomApi } from 'types';

type ElementsContextValue = {
  initialized: boolean,
  panZoomRef: React.MutableRefObject<PanZoomApi>
}

const ElementsContext = createContext({} as ElementsContextValue);

export default ElementsContext;
