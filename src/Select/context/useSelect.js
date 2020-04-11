import { useContext } from 'react';

import SelectContext from './SelectContext';

const useSelect = () => useContext(SelectContext);

export default useSelect;
