import { useContext } from 'react';

import PanZoomContext from './PanZoomContext';

const useUrlSync = () => useContext(PanZoomContext);

export default useUrlSync;
