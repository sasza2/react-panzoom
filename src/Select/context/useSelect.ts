import { useContext } from 'react';

import SelectContext, { SelectContextType } from './SelectContext';

const useSelect = (): SelectContextType => useContext(SelectContext);

export default useSelect;
