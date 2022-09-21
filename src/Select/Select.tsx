import React, { useMemo } from 'react';

import { SELECT_STYLE, SELECT_BOX_STYLE } from 'styles';
import useBoundary from './hooks/useBoundary';
import useBoundaryMove from './hooks/useBoundaryMove';
import useGrabElements from './hooks/useGrabElements';
import SelectProvider, { useSelect } from './context';

const Select = () => {
  const { selectRef, expandingRef, movingRef } = useSelect();
  const { boundary, expanding } = useBoundary();
  const grabElementsRef = useGrabElements();
  useBoundaryMove({ grabElementsRef });

  const boundaryStyle: React.CSSProperties = useMemo(() => {
    const style = { ...SELECT_BOX_STYLE }
    if (boundary) {
      style.transform = `translate(${boundary.left}px, ${boundary.top}px)`;
      style.width = boundary.width;
      style.height = boundary.height;
    }
    return style
  }, [boundary]);

  return (
    <div ref={selectRef} style={SELECT_STYLE}>
      {
        expanding && !boundary && (
          <div ref={expandingRef} style={SELECT_BOX_STYLE} />
        )
      }
      {
        boundary && (
          <div ref={movingRef} style={boundaryStyle} />
        )
      }
    </div>
  );
};

const SelectWithProvider: React.FC = () => (
  <SelectProvider>
    <Select />
  </SelectProvider>
);

export default SelectWithProvider;
