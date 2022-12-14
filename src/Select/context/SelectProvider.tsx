import React, { useRef, useState } from 'react';

import { Position } from 'types';
import SelectContext, { SelectContextType } from './SelectContext';

const SelectProvider: React.FC = ({
  children,
}) => {
  const expandingRef = useRef<HTMLDivElement>();
  const movingRef = useRef<HTMLDivElement>();
  const selectRef = useRef<HTMLDivElement>();
  const [boundary, setBoundary] = useState<SelectContextType['boundary'] | null>(null);
  const [move, setMove] = useState<Position | null>(null);

  return (
    <SelectContext.Provider
      value={{
        boundary,
        setBoundary,
        expandingRef,
        movingRef,
        selectRef,
        move,
        setMove,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

export default SelectProvider;
