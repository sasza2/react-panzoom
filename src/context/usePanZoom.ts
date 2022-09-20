import { useContext } from 'react';

import PanZoomContext, { PanZoomContextProps } from './PanZoomContext';

const usePanZoom = (): PanZoomContextProps => useContext(PanZoomContext);

export default usePanZoom;
