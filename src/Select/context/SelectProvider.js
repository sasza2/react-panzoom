import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import SelectContext from './SelectContext';

const SelectProvider = ({
  children,
}) => {
  const expandingRef = useRef();
  const movingRef = useRef();
  const selectRef = useRef();
  const [boundary, setBoundary] = useState(null);

  return (
    <SelectContext.Provider
      value={{
        boundary,
        setBoundary,
        expandingRef,
        movingRef,
        selectRef,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

SelectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SelectProvider;
